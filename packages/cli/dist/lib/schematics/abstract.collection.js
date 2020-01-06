"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
class AbstractCollection {
    constructor(collection, runner) {
        this.collection = collection;
        this.runner = runner;
        this.debug = debug_1.debug('schematic:collection');
    }
    async execute(name, options, extraFlags) {
        let command = this.buildCommandLine(name, options);
        command = extraFlags ? command.concat(` ${extraFlags}`) : command;
        this.debug(`Execute command: schematics ${command}`);
        await this.runner.run(command);
    }
    buildCommandLine(name, options) {
        return `${this.collection}:${name}${this.buildOptions(options)}`;
    }
    buildOptions(options) {
        return options.reduce((line, option) => {
            return line.concat(` ${option.toCommandString()}`);
        }, '');
    }
}
exports.AbstractCollection = AbstractCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QuY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc2NoZW1hdGljcy9hYnN0cmFjdC5jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsaUNBQXVDO0FBRXZDLE1BQWEsa0JBQWtCO0lBSTdCLFlBQXNCLFVBQWtCLEVBQVksTUFBc0I7UUFBcEQsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFZLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBRjFFLFVBQUssR0FBRyxhQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUV1QyxDQUFDO0lBRXZFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBWSxFQUFFLE9BQTBCLEVBQUUsVUFBbUI7UUFDaEYsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsK0JBQStCLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDckQsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsSUFBWSxFQUFFLE9BQTBCO1FBQy9ELE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDbkUsQ0FBQztJQUVPLFlBQVksQ0FBQyxPQUEwQjtRQUM3QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDVCxDQUFDO0NBQ0Y7QUF0QkQsZ0RBc0JDIn0=