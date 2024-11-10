"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    const createFullStructure = vscode.commands.registerCommand('extension.crearEstructuraDenoCompleta', (uri) => {
        if (uri && uri.fsPath) {
            const projectPath = uri.fsPath;
            createDenoFullStructure(projectPath);
        }
    });
    const createFeatureStructure = vscode.commands.registerCommand('extension.crearEstructuraFeatureDeno', (uri) => {
        if (uri && uri.fsPath) {
            const featurePath = uri.fsPath;
            createDenoFeatureStructure(featurePath);
        }
    });
    context.subscriptions.push(createFullStructure);
    context.subscriptions.push(createFeatureStructure);
}
exports.activate = activate;
function createDenoFullStructure(projectPath) {
    const structure = {
        'deps.ts': getDepsFileContent(),
        'main.ts': getMainFileContent(),
        '.env': getEnvFileContent(),
        'deno.json': getDenoConfigContent(),
        'middlewares': {
            'error.middleware.ts': getErrorMiddlewareContent(),
            'auth.middleware.ts': getAuthMiddlewareContent(),
            'logger.middleware.ts': getLoggerMiddlewareContent()
        },
        'settings': {
            'config.ts': getConfigFileContent(),
            'database.ts': getDatabaseConfigContent()
        },
        'src': {
            'feature_a': getFeatureStructure('feature_a')
        }
    };
    createDirectoriesAndFiles(projectPath, structure);
    vscode.window.showInformationMessage('Estructura de proyecto Deno/Oak creada con éxito.');
}
function createDenoFeatureStructure(featurePath) {
    let featureName = 'feature_a';
    let counter = 1;
    while (fs.existsSync(path.join(featurePath, featureName))) {
        if (counter < 26) {
            featureName = `feature_${String.fromCharCode(97 + counter)}`;
        }
        else {
            featureName = `feature_${counter - 25}`;
        }
        counter++;
    }
    const structure = getFeatureStructure(featureName);
    createDirectoriesAndFiles(featurePath, structure);
    vscode.window.showInformationMessage(`Feature '${featureName}' creado con éxito.`);
}
function createDirectoriesAndFiles(basePath, structure) {
    for (const name in structure) {
        const value = structure[name];
        const newPath = path.join(basePath, name);
        if (typeof value === 'object') {
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath);
            }
            createDirectoriesAndFiles(newPath, value);
        }
        else {
            fs.writeFileSync(newPath, value);
        }
    }
}
function getFeatureStructure(featureName) {
    const templates = getFeatureTemplates(featureName);
    return {
        'controllers': {
            [`${featureName}_controller.ts`]: templates.controller
        },
        'db': {
            [`${featureName}_db_service.ts`]: templates.dbService
        },
        'models': {
            [`${featureName}_model.ts`]: templates.model,
            [`${featureName}_schema.ts`]: templates.schema
        },
        'routes': {
            [`${featureName}_routes.ts`]: templates.routes
        },
        'services': {
            [`${featureName}_service.ts`]: templates.service
        }
    };
}
function getErrorMiddlewareContent() {
    return `
import { Context, isHttpError, Status } from "../deps.ts";

export async function errorMiddleware(ctx: Context, next: () => Promise<unknown>) {
    try {
        await next();
    } catch (err) {
        if (isHttpError(err)) {
            ctx.response.status = err.status;
            ctx.response.body = { 
                success: false, 
                message: err.message 
            };
        } else {
            ctx.response.status = Status.InternalServerError;
            ctx.response.body = { 
                success: false, 
                message: "Internal server error" 
            };
            console.error(err);
        }
    }
}`;
}
function getAuthMiddlewareContent() {
    return `
import { Context, Status } from "../deps.ts";
import { verifyJwt } from "../utils/jwt.ts";

export async function authMiddleware(ctx: Context, next: () => Promise<unknown>) {
    try {
        const header = ctx.request.headers.get("Authorization");
        if (!header) {
            ctx.response.status = Status.Unauthorized;
            ctx.response.body = { 
                success: false, 
                message: "No authorization header" 
            };
            return;
        }

        const token = header.replace("Bearer ", "");
        const payload = await verifyJwt(token);
        ctx.state.user = payload;

        await next();
    } catch (err) {
        ctx.response.status = Status.Unauthorized;
        ctx.response.body = { 
            success: false, 
            message: "Invalid token" 
        };
    }
}`;
}
function getLoggerMiddlewareContent() {
    return `
import { Context } from "../deps.ts";

export async function loggerMiddleware(ctx: Context, next: () => Promise<unknown>) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(\`\${ctx.request.method} \${ctx.request.url} - \${ms}ms\`);
}`;
}
function getDatabaseConfigContent() {
    return `
import { Client } from "../deps.ts";
import { config } from "./config.ts";

export const db = await new Client().connect({
    hostname: config.DB_HOST,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    db: config.DB_NAME,
    port: config.DB_PORT,
});`;
}
// Contenido de archivos base
function getDepsFileContent() {
    return `
// Oak framework
export {
	Application,
	Router,
	Context,
	Status,
	isHttpError,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";

// MySQL client
export { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

// Environment variables
export { config as dotenvConfig } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Validación de datos
export {
	validate,
	required,
	isString,
	isNumber,
	isEmail,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

// Utilidades
export { v4 as uuid } from "https://deno.land/std@0.208.0/uuid/mod.ts";
export * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
export * as jwt from "https://deno.land/x/djwt@v2.9.1/mod.ts";
`;
}
function getDenoConfigContent() {
    return `{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-env --watch main.ts",
    "start": "deno run --allow-net --allow-read --allow-env main.ts"
  },
  "imports": {
    "@/": "./",
    "@deps": "./deps.ts"
  }
}`;
}
function getEnvFileContent() {
    return `# Server Configuration
PORT=8000
ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=deno_app
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h`;
}
function getFeatureTemplates(featureName) {
    const capitalizedName = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return {
        controller: `
import { Context, Status } from "../../../deps.ts";
import { ${capitalizedName}Service } from "../services/${featureName}_service.ts";
import { I${capitalizedName} } from "../models/${featureName}_model.ts";

export class ${capitalizedName}Controller {
	private service: ${capitalizedName}Service;

	constructor() {
		this.service = new ${capitalizedName}Service();
	}

	getAll = async (ctx: Context) => {
		try {
			const items = await this.service.getAll();
			ctx.response.body = { success: true, data: items };
		} catch (error) {
			ctx.response.status = Status.InternalServerError;
			ctx.response.body = { success: false, message: error.message };
		}
	};

	getById = async (ctx: Context) => {
		try {
			const id = ctx.params.id;
			const item = await this.service.getById(id);
			if (!item) {
				ctx.response.status = Status.NotFound;
				ctx.response.body = { success: false, message: "Item not found" };
				return;
			}
			ctx.response.body = { success: true, data: item };
		} catch (error) {
			ctx.response.status = Status.InternalServerError;
			ctx.response.body = { success: false, message: error.message };
		}
	};

	create = async (ctx: Context) => {
		try {
			const body = ctx.request.body();
			const value = await body.value;
			const item = await this.service.create(value);
			ctx.response.status = Status.Created;
			ctx.response.body = { success: true, data: item };
		} catch (error) {
			ctx.response.status = Status.BadRequest;
			ctx.response.body = { success: false, message: error.message };
		}
	};
}`,
        model: `
export interface I${capitalizedName} {
	id?: number;
	createdAt?: Date;
	updatedAt?: Date;
	// Añade aquí las propiedades específicas de tu modelo
}

export interface I${capitalizedName}Create extends Omit<I${capitalizedName}, 'id' | 'createdAt' | 'updatedAt'> {}
export interface I${capitalizedName}Update extends Partial<I${capitalizedName}Create> {}`,
        schema: `
import { validate, required, isString, isNumber } from "../../../deps.ts";

export const ${featureName}Schema = {
	id: [isNumber],
	// Añade aquí las validaciones de tu esquema
};

export const create${capitalizedName}Schema = {
	// Añade aquí las validaciones para la creación
};

export const update${capitalizedName}Schema = {
	// Añade aquí las validaciones para la actualización
};`,
        dbService: `
import { Client } from "../../../deps.ts";
import { db } from "../../../settings/database.ts";
import { I${capitalizedName}, I${capitalizedName}Create, I${capitalizedName}Update } from "../models/${featureName}_model.ts";

export class ${capitalizedName}DbService {
	private tableName = "${featureName}s";

	async findAll(): Promise<I${capitalizedName}[]> {
		const result = await db.query(\`SELECT * FROM \${this.tableName}\`);
		return result.rows;
	}

	async findById(id: number): Promise<I${capitalizedName} | null> {
		const result = await db.query(
			\`SELECT * FROM \${this.tableName} WHERE id = ?\`,
			[id]
		);
		return result.rows[0] || null;
	}

	async create(data: I${capitalizedName}Create): Promise<I${capitalizedName}> {
		const result = await db.query(
			\`INSERT INTO \${this.tableName} SET ?\`,
			[data]
		);
		return { ...data, id: result.lastInsertId };
	}

	async update(id: number, data: I${capitalizedName}Update): Promise<boolean> {
		const result = await db.query(
			\`UPDATE \${this.tableName} SET ? WHERE id = ?\`,
			[data, id]
		);
		return result.affectedRows > 0;
	}

	async delete(id: number): Promise<boolean> {
		const result = await db.query(
			\`DELETE FROM \${this.tableName} WHERE id = ?\`,
			[id]
		);
		return result.affectedRows > 0;
	}
}`,
        service: `
import { ${capitalizedName}DbService } from "../db/${featureName}_db_service.ts";
import { I${capitalizedName}, I${capitalizedName}Create, I${capitalizedName}Update } from "../models/${featureName}_model.ts";

export class ${capitalizedName}Service {
	private dbService: ${capitalizedName}DbService;

	constructor() {
		this.dbService = new ${capitalizedName}DbService();
	}

	async getAll(): Promise<I${capitalizedName}[]> {
		return await this.dbService.findAll();
	}

	async getById(id: number): Promise<I${capitalizedName} | null> {
		return await this.dbService.findById(id);
	}

	async create(data: I${capitalizedName}Create): Promise<I${capitalizedName}> {
		return await this.dbService.create(data);
	}

	async update(id: number, data: I${capitalizedName}Update): Promise<boolean> {
		return await this.dbService.update(id, data);
	}

	async delete(id: number): Promise<boolean> {
		return await this.dbService.delete(id);
	}
}`,
        routes: `
import { Router } from "../../../deps.ts";
import { ${capitalizedName}Controller } from "../controllers/${featureName}_controller.ts";

const router = new Router({ prefix: "/api/${featureName}" });
const controller = new ${capitalizedName}Controller();

router
	.get("/", controller.getAll)
	.get("/:id", controller.getById)
	.post("/", controller.create);

export { router as ${featureName}Router };`
    };
}
function getMainFileContent() {
    return `
import { Application } from "./deps.ts";
import { config } from "./settings/config.ts";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { loggerMiddleware } from "./middlewares/logger.middleware.ts";
import { featureARouter } from "./src/feature_a/routes/feature_a_routes.ts";

const app = new Application();

// Middlewares globales
app.use(errorMiddleware);
app.use(loggerMiddleware);

// Configuración de CORS
app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    await next();
});

// Rutas
app.use(featureARouter.routes());
app.use(featureARouter.allowedMethods());

// Iniciar servidor
console.log(\`🚀 Servidor corriendo en http://localhost:\${config.PORT}\`);
await app.listen({ port: Number(config.PORT) });
`;
}
function getConfigFileContent() {
    return `
import { dotenvConfig } from "../deps.ts";

await dotenvConfig({ export: true });

export const config = {
	// Server Configuration
	PORT: Deno.env.get("PORT") || "8000",
	ENV: Deno.env.get("ENV") || "development",

	// Database Configuration
	DB_HOST: Deno.env.get("DB_HOST") || "localhost",
	DB_USER: Deno.env.get("DB_USER") || "root",
	DB_PASSWORD: Deno.env.get("DB_PASSWORD") || "",
	DB_NAME: Deno.env.get("DB_NAME") || "deno_app",
	DB_PORT: Number(Deno.env.get("DB_PORT")) || 3306,

	// JWT Configuration
	JWT_SECRET: Deno.env.get("JWT_SECRET") || "your-secret-key",
	JWT_EXPIRES_IN: Deno.env.get("JWT_EXPIRES_IN") || "24h",

	// API Configuration
	API_PREFIX: "/api",
	CORS_ORIGIN: Deno.env.get("CORS_ORIGIN") || "*",
};

// Validar configuración requerida
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const envVar of requiredEnvVars) {
	if (!Deno.env.get(envVar)) {
		console.warn(\`⚠️  Warning: \${envVar} no está configurado en el archivo .env\`);
	}
}

console.log("✅ Configuración cargada correctamente");
`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map