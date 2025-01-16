import SplitVideoFramesService, { SplitVideoInput, SplitVideoOutput } from "../../core/service/SplitVideoFramesService";
import { join } from 'path'
import { mkdirSync, existsSync, readdir } from 'fs'
import ffmpegPath from 'ffmpeg-static';
import { exec } from 'child_process'
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import Logger from "../../infra/logger/Logger";

@injectable()
export default class SplitVideoFramesServiceImpl implements SplitVideoFramesService {

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger
    ) {}
    
    async split(input: SplitVideoInput): Promise<SplitVideoOutput> {
    
        this.logger.info(`Start split video`, { input })

        if(!existsSync(input.outputDir)) {
            this.logger.warn(`Directory ${input.outputDir} not found, create ${input.outputDir} directory`)
            mkdirSync(input.outputDir)
        }

        const outputPattern = join(input.outputDir, 'frame-%03d.jpg')
        const fps = 1; // Frames por segundo
        const command = `${ffmpegPath} -i ${input.filePath} -vf fps=${fps} ${outputPattern}`
        this.logger.debug(`Convert command: ${command}`)

        await this.generateFrames(command)

        const files = await new Promise((resolve, reject) => {

            readdir(input.outputDir, (error, files) => {
                if(error) {
                    reject(error)
                }
                resolve(files)
            })
        })

        return {
            outputDir: input.outputDir,
            filenames: files as Array<string>
        }

    }

    async generateFrames(command: string): Promise<void> {
        this.logger.debug(`Generate frames with command ${command}`)
        return new Promise((resolve, reject) => {

            exec(command, (error, stdout, stderr) => {
                if(error) {
                    this.logger.error(`Error on try divide video into frames: ${error.message}`, { error, stdout, stderr })
                    reject()
                }
            
                this.logger.debug(`Generated frames with successfully`, { stdout, stderr })
                resolve()
            })
        })
    }

}
