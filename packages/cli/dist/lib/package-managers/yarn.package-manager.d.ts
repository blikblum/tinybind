import { AbstractPackageManager } from "./abstract.package-manager";
import { PackageManagerCommands } from "../../interfaces";
export declare class YarnPackageManager extends AbstractPackageManager {
    constructor();
    get name(): string;
    get cli(): PackageManagerCommands;
}
