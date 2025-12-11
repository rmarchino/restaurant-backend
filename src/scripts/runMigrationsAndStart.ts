import { AppDataSource } from "../config/data-source";
import { exec } from 'child_process';

async function run() {
    try {
        console.log("Inicializando data source...");
        await AppDataSource.initialize();

        console.log("Ejecutando migraciones...");
        await AppDataSource.runMigrations();

        console.log("Migraciones ejecutadas correctamente.");
        await AppDataSource.destroy();

        const child = exec('node dist/index.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al iniciar el servidor: ${error.message}`);
                process.exit(1);
            }
        });

        child.stdout?.pipe(process.stdout);
        child.stderr?.pipe(process.stderr);

    } catch (error) {
        console.error("Error al ejecutar migraciones:", error);
        process.exit(1);
    }
}