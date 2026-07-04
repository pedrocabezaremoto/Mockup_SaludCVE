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

const defaultOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:4173',
    'http://localhost:4174'
];
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

const canAppointmentBeApproved = (doctorId) => {
    const doctor = db.prepare('SELECT centroId FROM doctors WHERE id = ?').get(doctorId);
    if (!doctor) return false;
    const center = db.prepare('SELECT colapsado FROM health_centers WHERE id = ?').get(doctor.centroId);
    if (!center) return false;
    return center.colapsado === 0;
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
    const { userId, doctorId } = req.query;
    if (userId) {
        const rows = db
            .prepare('SELECT * FROM appointments WHERE usuarioId = ? ORDER BY createdAt DESC')
            .all(userId);
        res.json(rows.map(mapAppointmentRow));
        return;
    }
    if (doctorId) {
        const rows = db
            .prepare('SELECT * FROM appointments WHERE doctorId = ? ORDER BY createdAt DESC')
            .all(doctorId);
        res.json(rows.map(mapAppointmentRow));
        return;
    }

    const rows = db.prepare('SELECT * FROM appointments ORDER BY createdAt DESC').all();
    res.json(rows.map(mapAppointmentRow));
});

app.put('/api/appointments/:id/status', (req, res) => {
    const { id } = req.params;
    const { estado, motivoRechazo } = req.body || {};

    if (!estado) {
        res.status(400).json({ message: 'El estado es requerido' });
        return;
    }

    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    if (!appointment) {
        res.status(404).json({ message: 'Cita no encontrada' });
        return;
    }

    db.prepare('UPDATE appointments SET estado = ?, motivoRechazo = ? WHERE id = ?')
        .run(estado, motivoRechazo || null, id);

    const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    res.json(mapAppointmentRow(updated));
});

app.put('/api/health-centers/:id/toggle-collapse', (req, res) => {
    const { id } = req.params;
    const center = db.prepare('SELECT * FROM health_centers WHERE id = ?').get(id);
    if (!center) {
        res.status(404).json({ message: 'Centro de salud no encontrado' });
        return;
    }

    const newCollapsed = center.colapsado === 1 ? 0 : 1;
    db.prepare('UPDATE health_centers SET colapsado = ? WHERE id = ?').run(newCollapsed, id);

    const updated = db.prepare('SELECT * FROM health_centers WHERE id = ?').get(id);
    res.json(mapHealthCenterRow(updated));
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
    const appointmentApproved = validation.isValid && canAppointmentBeApproved(doctorId);

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
