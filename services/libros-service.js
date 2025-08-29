import LibrosRepository from '../repositories/libros-repository.js';

export default class LibrosService {
    constructor() {
        this.LibrosRepository = new LibrosRepository();
    }

    getAllAsync = async () => await this.LibrosRepository.getAllAsync()
    getByIdAsync = async (id) => await this.LibrosRepository.getByIdAsync(id)
    createAsync = async (entity) => await this.LibrosRepository.createAsync(entity)
    updateAsync = async (entity) => await this.LibrosRepository.updateAsync(entity)
    deleteByIdAsync = async (id) => await this.LibrosRepository.deleteByIdAsync(id)
}
