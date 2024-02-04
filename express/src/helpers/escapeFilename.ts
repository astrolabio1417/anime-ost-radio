export function escapeFilename(filename: string) {
    return filename.replace(/["<>#%{}|\\/^~[\]`;?:@=&]/gi, '')
}
