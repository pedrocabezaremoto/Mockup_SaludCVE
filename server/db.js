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
            tipo TEXT NOT NULL
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
        INSERT INTO users (id, nombre, cedula, telefono, tipo)
        VALUES (@id, @nombre, @cedula, @telefono, @tipo)
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

export const initDb = () => {
    const dbPath = process.env.DATABASE_URL || DEFAULT_DB_PATH;
    ensureDirectory(dbPath);
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    createTables(db);
    seedIfNeeded(db);
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
