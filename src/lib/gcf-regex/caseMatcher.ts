var path = require('path');
var path_to_instance_text = path.join(__dirname, 'instanceTypes.txt');
var fs = require('fs')
function readFile(filename: string): any[] {
    // readFile takes in a file name for the instance names, then returns a list of the strings from a local file with name ${filename}
    try {
        var data = fs.readFileSync(filename, 'utf8');
        if (!data) {
            throw new Error("Failed to read instance types, the data I have is: ".concat(data, "."));
        }
        console.log("Retrieved instance types");
        var instanceList = data.split('\n');
        // remove duplicates
        return ([...new Set(instanceList)]);
    }
    catch (error) {
        console.error("Error reading instance type list: ".concat(String(error)));
        throw Error(`Could not retrieve instance type file using node fs. Path is ${path_to_instance_text}`);
    }
}
function matchTypes(toCompare: string, instanceList: string[]): string {
    let matched_result = ""
    for (var i = 0; i < instanceList.length; i++) {
        var upperToCompare = toCompare.toUpperCase();
        if (upperToCompare.trim() === instanceList[i].toUpperCase().trim()) {
            matched_result = instanceList[i];
        }
    }
    if (matched_result ==""){
        throw Error(`No matching instance type found for instance type ${toCompare}`)
    }
    return matched_result
}

export default function caseMatch(toCompare: string){
    console.info("Entering caseMatch function...\n        Path to file: ".concat(path_to_instance_text, ",\n        String to compare: ").concat(toCompare));
    let res= matchTypes(toCompare, readFile(path_to_instance_text));
    console.log(`Matched result: ${toCompare} is ${res}`)
    return res
}