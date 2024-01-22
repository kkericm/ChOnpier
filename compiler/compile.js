const fs = require('fs-extra');
const path = require('path');
const { exec, execSync } = require('child_process');
const {rimraf} = require('rimraf');

const config = JSON.parse(fs.readFileSync('./config.json'))

const pastaDestino1 = `C:/Users/Eric Melo/Desktop/ChOnpiler/tests/mojang-simul/development_resource_packs/${config.name} RP/`;
const pastaDestino2 = `C:/Users/Eric Melo/Desktop/ChOnpiler/tests/mojang-simul/development_behavior_packs/${config.name} BP/`;

try {
    fs.mkdirSync(pastaDestino1)
    fs.mkdirSync(pastaDestino2)
} catch {}

async function removerArquivosTS(caminho) {
    try {
        const itens = await fs.readdir(caminho);
    
        for (const item of itens) {
            const caminhoItem = path.join(caminho, item);
            const stats = await fs.stat(caminhoItem);
    
            if (stats.isDirectory()) {
                await removerArquivosTS(caminhoItem);
            } else if (stats.isFile() && path.extname(item) === '.ts') {
                await fs.unlink(caminhoItem);
                console.log(`Removido: ${caminhoItem}`);
            }
        }
    } catch (error) {
      console.error('Erro ao remover arquivos .ts:', error);
    }
}

async function copiarArquivosModificados(caminhoAtual, caminhoDestino) {
    try {
        const itens = await fs.readdir(caminhoAtual);
    
        for (const item of itens) {
                const caminhoItemOrigem = path.join(caminhoAtual, item);
                const caminhoItemDestino1 = path.join(caminhoDestino, item);
        
                const statsOrigem = await fs.stat(caminhoItemOrigem);
                const statsDestino1 = await fs.stat(caminhoItemDestino1).catch(() => null);
        
                if (statsOrigem.isDirectory()) {
                    await copiarArquivosModificados(caminhoItemOrigem, caminhoItemDestino1);
                } else if (statsOrigem.isFile()) {
                    if (!statsDestino1 || statsOrigem.mtime > statsDestino1.mtime) {
                        await fs.copy(caminhoItemOrigem, caminhoItemDestino1);
                        console.log(`Copiado para ${pastaDestino1}: ${caminhoItemOrigem}`);
                    }
                }
            }
    } catch (error) {
        console.error('Erro ao copiar arquivos:', error);
    }
}

copiarArquivosModificados("./RP", pastaDestino1)
copiarArquivosModificados("./BP", pastaDestino2)
fs.writeFileSync(`${pastaDestino2}/tsconfig.json`, JSON.stringify(config.tsConfig, undefined, 4), { encoding: "utf-8" })

const command = `tsc -p "${pastaDestino2}tsconfig.json"`

execSync(command)

removerArquivosTS(pastaDestino2)

fs.removeSync(`${pastaDestino2}/tsconfig.json`)