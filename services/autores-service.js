import AutoresRepository from '../repositories/autores-repository.js';

export default class AutoresService {
    constructor() {
        this.AutoresRepository = new AutoresRepository();
    }

    getAllAsync = async () => await this.AutoresRepository.getAllAsync()
    getByIdAsync = async (id) => await this.AutoresRepository.getByIdAsync(id)
    createAsync = async (entity) => await this.AutoresRepository.createAsync(entity)
    updateAsync = async (entity) => await this.AutoresRepository.updateAsync(entity)
    deleteByIdAsync = async (id) => await this.AutoresRepository.deleteByIdAsync(id)
}
