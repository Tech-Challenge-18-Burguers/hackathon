import * as fs from 'fs/promises'
import { createWriteStream, existsSync } from 'fs'
import archiver from 'archiver'
import CompressService, { CompressInput, CompressOutput } from '../../core/service/CompressService'
import * as path from 'path'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import Logger from '../../infra/logger/Logger'

@injectable()
export default class CompressServiceImpl implements CompressService {

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger
    ) {}

    async compress(input: CompressInput): Promise<CompressOutput> {

        this.logger.info(`Start compress files`, { input })
        const fileNames = await fs.readdir(input.baseDir)
        const files = fileNames.map(file => path.join(input.baseDir, file))

        await this.createZip(input.outputFile, files, input.baseDir)
        this.logger.info(`End of compress files`, { input })
        return {
            filename: input.outputFile
        }
    }

    async createZip(outputFile: string, files: Array<string>, baseDir: string): Promise<void> {
        const output = createWriteStream(outputFile)
        const archive = archiver('zip', { zlib: { level: 9 } })

        return new Promise((resolve, reject) => {
            output.on('close', () => {
                this.logger.info(`ZIP file created successfully: ${outputFile} (${archive.pointer()} bytes)`)
                resolve()
            })

            output.on('error', (err) => {
                this.logger.error('Error on try write to zip file:', err)
                reject(err)
            })

            archive.on('error', (err) => {
                this.logger.error('Error on try create ZIP:', err)
                reject(err)
            })

            archive.pipe(output)

            files.forEach((file) => {
                if (existsSync(file)) {
                    archive.file(file, { name: file.replace(baseDir, '') })
                } else {
                    this.logger.warn(`File not found: ${file}`)
                }
            })

            archive.finalize()
        })
    }

}