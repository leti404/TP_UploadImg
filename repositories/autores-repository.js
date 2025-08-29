import pkg from 'pg'
import config from './../configs/db-config.js'
import LogHelper from './../helpers/log-helper.js'

const { Pool } = pkg;

export default class AutoresRepository {
    constructor() {
        this.DBPool = null;
    }

    getDBPool = () => {
        if (this.DBPool == null){
            this.DBPool = new Pool(config);
        }
        return this.DBPool;
    }

    getAllAsync = async () => {
        let returnArray = null;
        try {
            const sql = `SELECT 
                            autores.id, 
                            autores.nombre, 
                            autores.nacionalidad, 
                            autores.imagen,
                            array (
                                SELECT json_build_object (
                                    'id', libros.id,
                                    'titulo', libros.titulo,
                                    'anio', libros.anio,
                                    'portada', libros.portada
                                )
                                FROM libros
                                WHERE libros.id_autor = autores.id
                                ORDER BY libros.id
                            ) AS libros
                        FROM autores
                        ORDER BY autores.id;`;
            const resultPg = await this.getDBPool().query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    getByIdAsync = async (id) => {
        let returnEntity = null;
        try {
            const sql = `SELECT * FROM autores WHERE id=$1`;
            const resultPg = await this.getDBPool().query(sql, [id]);
            if (resultPg.rows.length > 0){
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnEntity;
    }

    createAsync = async (entity) => {
        let newId = 0;
        try {
            const sql = `INSERT INTO autores (nombre, nacionalidad, imagen) 
                         VALUES ($1,$2,$3) RETURNING id`;
            const values = [
                entity?.nombre ?? '',
                entity?.nacionalidad ?? '',
                entity?.imagen ?? null
            ];
            const resultPg = await this.getDBPool().query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            LogHelper.logError(error);
        }
        return newId;
    }

    updateAsync = async (entity) => {
        let rowsAffected = 0;
        try {
            const previous = await this.getByIdAsync(entity.id);
            if (previous == null) return 0;
            const sql = `UPDATE autores SET 
                            nombre=$2, 
                            nacionalidad=$3, 
                            imagen=$4
                         WHERE id=$1`;
            const values = [
                entity.id,
                entity?.nombre ?? previous.nombre,
                entity?.nacionalidad ?? previous.nacionalidad,
                entity?.imagen ?? previous.imagen
            ];
            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        let rowsAffected = 0;
        try {
            const sql = `DELETE FROM autores WHERE id=$1`;
            const resultPg = await this.getDBPool().query(sql, [id]);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}
