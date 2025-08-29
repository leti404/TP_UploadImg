import pkg from 'pg'
import config from './../configs/db-config.js'
import LogHelper from './../helpers/log-helper.js'

const { Pool } = pkg;

export default class LibrosRepository {
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
                            libros.id, 
                            libros.titulo, 
                            libros.anio, 
                            libros.portada,
                            json_build_object (
                                'id', autores.id,
                                'nombre', autores.nombre,
                                'nacionalidad', autores.nacionalidad,
                                'imagen', autores.imagen
                            ) AS autor
                        FROM libros
                        INNER JOIN autores ON libros.id_autor = autores.id
                        ORDER BY libros.id;`;
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
            const sql = `SELECT * FROM libros WHERE id=$1`;
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
            const sql = `INSERT INTO libros (titulo, anio, id_autor, portada) 
                         VALUES ($1,$2,$3,$4) RETURNING id`;
            const values = [
                entity?.titulo ?? '',
                entity?.anio ?? null,
                entity?.id_autor ?? 0,
                entity?.portada ?? null
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
            const sql = `UPDATE libros SET 
                            titulo=$2, 
                            anio=$3, 
                            id_autor=$4, 
                            portada=$5
                         WHERE id=$1`;
            const values = [
                entity.id,
                entity?.titulo ?? previous.titulo,
                entity?.anio ?? previous.anio,
                entity?.id_autor ?? previous.id_autor,
                entity?.portada ?? previous.portada
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
            const sql = `DELETE FROM libros WHERE id=$1`;
            const resultPg = await this.getDBPool().query(sql, [id]);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}
