var path = require('path');
var path_to_instance_text = path.join(__dirname, 'instanceTypes.txt');
function readFile(filename) {
    // readFile takes in a file name for the instance names, then returns a list of the strings from a local file with name ${filename}
    try {
        var data = fs.readFileSync(filename, 'utf8');
        if (!data) {
            throw new Error("Failed to read instance types, the data I have is: ".concat(data, "."));
        }
        console.log("Retrieved instance types");
        var instanceList = data.split('\n');
        // remove duplicates
        let instanceSet = new Set(instanceList)

        return ([...instanceSet]);
    }
    catch (error) {
        console.error("Error reading instance type list: ".concat(error));
        throw Error(`Could not retrieve instance type file using node fs. Path is ${path_to_instance_text}`);
    }
}
function matchTypes(toCompare, instanceList, depth) {
    if (depth === void 0) { depth = 1; }
    for (var i = 0; i < instanceList.length; i++) {
        var upperToCompare = toCompare.toUpperCase();
        if (upperToCompare.trim() === instanceList[i].toUpperCase().trim()) {
            return instanceList[i];
        }
    }
    if (depth == 0) {
        throw Error("[GCF Plugin] The instance type ".concat(toCompare, " is not supported"));
    }
    refreshList();
    console.info("Refreshing list... ")
    sleep(5000)
    console.info("Reattempting match")
    return matchTypes(toCompare, instanceList, 0);
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}

export function caseMatch(toCompare){
    console.info("Entering caseMatch function...\n        Path to file: ".concat(path_to_instance_text, ",\n        String to compare: ").concat(toCompare));
    let res= matchTypes(toCompare, readFile(path_to_instance_text));
    console.log(`Matched result: ${toCompare} is ${res}`)
    return res
}

// import { Octokit } from 'octokit';
var fs = require('node:fs');
const { type } = require('os');

async function refreshList() {

    try{
        const {Octokit} = await import('octokit')
        const octokit = new Octokit()
        
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}',{
            owner: "Green-Software-Foundation",
            repo: "if-unofficial-plugins",
            path:"src/lib/ccf/azure-instances.json",
            headers: {
            'X-GitHub-Api-Version': '2022-11-28'
            }
          }
        )
        if(!response.status=='200'){
            throw new Error("Failed to refresh instance type lists")
        }
        
        let content = response.data.content
        const data = atob(content)
        const instanceTypes = []
        let instances = JSON.parse(data)
        console.log(`instances is type: ${typeof(instances)}`)
        console.warn(`====instance types retrieved from GitHub`)
        console.warn(`Total instances: ${instances.length} instances found`)
        for (const instance of instances){
            const vmName = instance["Virtual Machine"]
            if(vmName){
                instanceTypes.push(vmName)
            }
        }
        //write into .txt file
        fs.writeFileSync(path_to_instance_text,instanceTypes.join('\n'))
        console.info(`Successfully refreshed list with ${instances.length} entries`)
    }catch(error){
        console.error(`Error refreshing list of instance types: ${error}`)
    }
}

