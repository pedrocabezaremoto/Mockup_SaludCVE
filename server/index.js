import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {
    initDb,
    mapAppointmentRow,
    mapDoctorRow,
    mapHealthCenterRow,
    mapSpecialtyRow,
    mapUserRow,
} from './db.js';

const app = express();
const db = initDb();

// Forzar UTF-8 en todas las respuestas JSON
app.use((_req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

const defaultOrigins = ['http://localhost:5173', 'http://localhost:4173'];
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : defaultOrigins;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

app.use(cors({ origin: allowedOrigins }));
app.use('/api', apiLimiter);
app.use(express.json());

const validateSpecialtyAvailability = (appointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasPendingAppointment = appointments.some((appointment) => {
        const appointmentDate = new Date(appointment.fecha);
        appointmentDate.setHours(0, 0, 0, 0);
        const isDateNotPassed = appointmentDate >= today;
        const isNotCompleted =
            appointment.estado !== 'Completada' && appointment.estado !== 'Cancelada';
        return isDateNotPassed && isNotCompleted;
    });

    if (hasPendingAppointment) {
        return {
            isValid: false,
            message:
                'Ya tiene una cita pendiente en esta especialidad. Complete o cancele la cita anterior para agendar una nueva en esta especialidad.',
        };
    }

    return { isValid: true };
};

const canAppointmentBeApproved = (userId) => {
    if (userId === 'user-maria') {
        return true;
    }
    if (userId === 'user-pablo') {
        return false;
    }
    return true;
};

app.get('/api/health-centers', (_req, res) => {
    const rows = db.prepare('SELECT * FROM health_centers ORDER BY nombre').all();
    res.json(rows.map(mapHealthCenterRow));
});

app.get('/api/specialties', (_req, res) => {
    const rows = db.prepare('SELECT * FROM specialties ORDER BY nombre').all();
    res.json(rows.map(mapSpecialtyRow));
});

app.get('/api/doctors', (req, res) => {
    const { centerId, specialtyId } = req.query;
    const filters = [];
    const params = [];

    if (centerId) {
        filters.push('centroId = ?');
        params.push(centerId);
    }

    if (specialtyId) {
        filters.push('especialidadId = ?');
        params.push(specialtyId);
    }

    const whereClause = filters.length ? ` WHERE ${filters.join(' AND ')}` : '';
    const rows = db
        .prepare(`SELECT * FROM doctors${whereClause} ORDER BY nombre`)
        .all(...params);
    res.json(rows.map(mapDoctorRow));
});

app.get('/api/doctors/:id', (req, res) => {
    const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(req.params.id);
    if (!doctor) {
        res.status(404).json({ message: 'Doctor no encontrado' });
        return;
    }
    res.json(mapDoctorRow(doctor));
});

app.get('/api/users', (_req, res) => {
    const rows = db.prepare('SELECT * FROM users ORDER BY nombre').all();
    res.json(rows.map(mapUserRow));
});

app.get('/api/users/:id', (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    res.json(mapUserRow(user));
});

app.post('/api/auth/login', (req, res) => {
    const { userId } = req.body || {};
    if (!userId) {
        res.status(400).json({ message: 'userId es requerido' });
        return;
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }

    res.json(mapUserRow(user));
});

app.get('/api/appointments', (req, res) => {
    const { userId } = req.query;
    if (userId) {
        const rows = db
            .prepare('SELECT * FROM appointments WHERE usuarioId = ? ORDER BY createdAt DESC')
            .all(userId);
        res.json(rows.map(mapAppointmentRow));
        return;
    }

    const rows = db.prepare('SELECT * FROM appointments ORDER BY createdAt DESC').all();
    res.json(rows.map(mapAppointmentRow));
});

app.post('/api/appointments', (req, res) => {
    const {
        usuarioId,
        doctorId,
        centroId,
        especialidadId,
        fecha,
        turno,
    } = req.body || {};

    if (!usuarioId || !doctorId || !centroId || !especialidadId || !fecha || !turno) {
        res.status(400).json({ message: 'Faltan datos obligatorios de la cita' });
        return;
    }

    const existingAppointments = db
        .prepare(
            'SELECT fecha, estado FROM appointments WHERE usuarioId = ? AND especialidadId = ?'
        )
        .all(usuarioId, especialidadId);

    const validation = validateSpecialtyAvailability(existingAppointments);
    const appointmentApproved = validation.isValid && canAppointmentBeApproved(usuarioId);

    const createdAt = new Date().toISOString();
    const appointmentId = `apt-${Date.now()}`;
    const estado = appointmentApproved ? 'Reservada' : 'Rechazada';
    const motivoRechazo = validation.isValid
        ? appointmentApproved
            ? null
            : 'Sin disponibilidad - Centro de salud temporalmente sin capacidad de atención'
        : validation.message;

    db.prepare(
        `
        INSERT INTO appointments (
            id,
            usuarioId,
            doctorId,
            centroId,
            especialidadId,
            fecha,
            turno,
            estado,
            motivoRechazo,
            createdAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
        appointmentId,
        usuarioId,
        doctorId,
        centroId,
        especialidadId,
        fecha,
        turno,
        estado,
        motivoRechazo,
        createdAt
    );

    res.status(201).json(
        mapAppointmentRow({
            id: appointmentId,
            usuarioId,
            doctorId,
            centroId,
            especialidadId,
            fecha,
            turno,
            estado,
            motivoRechazo,
            createdAt,
        })
    );
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => {
    console.log(`API de SaludConecta VE escuchando en puerto ${port}`);
});
