import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import seedData from './seedData.js';

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'server', 'data', 'telemedicina.sqlite');

const ensureDirectory = (filePath) => {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
};

const createTables = (db) => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS health_centers (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            direccion TEXT NOT NULL,
            telefono TEXT NOT NULL,
            colapsado INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS specialties (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            icono TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS doctors (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            especialidadId TEXT NOT NULL,
            centroId TEXT NOT NULL,
            horarioManana TEXT NOT NULL,
            horarioTarde TEXT NOT NULL,
            credenciales TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            cedula TEXT NOT NULL,
            telefono TEXT NOT NULL,
            tipo TEXT NOT NULL,
            rol TEXT NOT NULL DEFAULT 'paciente',
            doctorId TEXT
        );
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            usuarioId TEXT NOT NULL,
            doctorId TEXT NOT NULL,
            centroId TEXT NOT NULL,
            especialidadId TEXT NOT NULL,
            fecha TEXT NOT NULL,
            turno TEXT NOT NULL,
            estado TEXT NOT NULL,
            motivoRechazo TEXT,
            createdAt TEXT NOT NULL
        );
    `);
};

const seedIfNeeded = (db) => {
    const existing = db.prepare('SELECT COUNT(*) as count FROM health_centers').get();
    if (existing.count > 0) {
        return;
    }

    const insertHealthCenter = db.prepare(`
        INSERT INTO health_centers (id, nombre, direccion, telefono, colapsado)
        VALUES (@id, @nombre, @direccion, @telefono, @colapsado)
    `);
    const insertSpecialty = db.prepare(`
        INSERT INTO specialties (id, nombre, icono)
        VALUES (@id, @nombre, @icono)
    `);
    const insertDoctor = db.prepare(`
        INSERT INTO doctors (id, nombre, especialidadId, centroId, horarioManana, horarioTarde, credenciales)
        VALUES (@id, @nombre, @especialidadId, @centroId, @horarioManana, @horarioTarde, @credenciales)
    `);
    const insertUser = db.prepare(`
        INSERT INTO users (id, nombre, cedula, telefono, tipo, rol, doctorId)
        VALUES (@id, @nombre, @cedula, @telefono, @tipo, @rol, @doctorId)
    `);

    const insertTransaction = db.transaction(() => {
        seedData.healthCenters.forEach((center) => {
            insertHealthCenter.run({
                ...center,
                colapsado: center.colapsado ? 1 : 0,
            });
        });
        seedData.specialties.forEach((specialty) => {
            insertSpecialty.run(specialty);
        });
        seedData.doctors.forEach((doctor) => {
            insertDoctor.run({
                id: doctor.id,
                nombre: doctor.nombre,
                especialidadId: doctor.especialidadId,
                centroId: doctor.centroId,
                horarioManana: doctor.horario.manana,
                horarioTarde: doctor.horario.tarde,
                credenciales: doctor.credenciales,
            });
        });
        seedData.users.forEach((user) => {
            insertUser.run(user);
        });
    });

    insertTransaction();
};

const migrateAndSeedNewUsers = (db) => {
    // 1. Verificar si existen las columnas rol y doctorId
    try {
        db.prepare('SELECT rol, doctorId FROM users LIMIT 1').get();
    } catch (e) {
        // Añadir columnas si no existen
        try {
            db.exec(`
                ALTER TABLE users ADD COLUMN rol TEXT NOT NULL DEFAULT 'paciente';
                ALTER TABLE users ADD COLUMN doctorId TEXT;
            `);
            console.log('Base de datos migrada: columnas "rol" y "doctorId" añadidas a la tabla users.');
        } catch (alterError) {
            console.error('Error al añadir columnas en la migración:', alterError);
        }
    }

    // 2. Insertar los nuevos usuarios si no existen
    const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (id, nombre, cedula, telefono, tipo, rol, doctorId)
        VALUES (@id, @nombre, @cedula, @telefono, @tipo, @rol, @doctorId)
    `);

    const usersToSeed = [
        {
            id: 'user-maria',
            nombre: 'María Fernández',
            cedula: 'V-12.345.678',
            telefono: '+58 424-1234567',
            tipo: 'maria',
            rol: 'paciente',
            doctorId: null,
        },
        {
            id: 'user-pablo',
            nombre: 'Pablo Hernández',
            cedula: 'V-23.456.789',
            telefono: '+58 412-9876543',
            tipo: 'pablo',
            rol: 'paciente',
            doctorId: null,
        },
        {
            id: 'user-admin',
            nombre: 'Dr. Francisco Valera (Administrador)',
            cedula: 'V-9.876.543',
            telefono: '+58 246-1111111',
            tipo: 'admin',
            rol: 'admin',
            doctorId: null,
        },
        {
            id: 'user-doctor1',
            nombre: 'Dra. Elena Rodríguez',
            cedula: 'V-11.222.333',
            telefono: '+58 424-2222222',
            tipo: 'doctor',
            rol: 'doctor',
            doctorId: 'doc-001',
        },
        {
            id: 'user-doctor2',
            nombre: 'Dr. Ricardo Tovar',
            cedula: 'V-10.444.555',
            telefono: '+58 412-3333333',
            tipo: 'doctor',
            rol: 'doctor',
            doctorId: 'doc-003',
        },
    ];

    try {
        const trans = db.transaction(() => {
            usersToSeed.forEach((u) => {
                insertUser.run(u);
            });
        });
        trans();
    } catch (seedError) {
        console.error('Error al insertar usuarios adicionales:', seedError);
    }
};

export const initDb = () => {
    const dbPath = process.env.DATABASE_URL || DEFAULT_DB_PATH;
    ensureDirectory(dbPath);
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    createTables(db);
    seedIfNeeded(db);
    migrateAndSeedNewUsers(db);
    return db;
};

export const mapHealthCenterRow = (row) => ({
    id: row.id,
    nombre: row.nombre,
    direccion: row.direccion,
    telefono: row.telefono,
    colapsado: Boolean(row.colapsado),
});

export const mapSpecialtyRow = (row) => ({
    id: row.id,
    nombre: row.nombre,
    icono: row.icono,
});

export const mapDoctorRow = (row) => ({
    id: row.id,
    nombre: row.nombre,
    especialidadId: row.especialidadId,
    centroId: row.centroId,
    horario: {
        manana: row.horarioManana,
        tarde: row.horarioTarde,
    },
    credenciales: row.credenciales,
});

export const mapUserRow = (row) => ({
    id: row.id,
    nombre: row.nombre,
    cedula: row.cedula,
    telefono: row.telefono,
    tipo: row.tipo,
    rol: row.rol || 'paciente',
    doctorId: row.doctorId || undefined,
});

export const mapAppointmentRow = (row) => ({
    id: row.id,
    usuarioId: row.usuarioId,
    doctorId: row.doctorId,
    centroId: row.centroId,
    especialidadId: row.especialidadId,
    fecha: row.fecha,
    turno: row.turno,
    estado: row.estado,
    motivoRechazo: row.motivoRechazo || undefined,
    createdAt: row.createdAt,
});
