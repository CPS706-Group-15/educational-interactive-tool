class Router {
  constructor(name) {
    this.name = name;
    this.connections = new Map();
  }
}

class Graph {
  constructor() {
    this.routers = new Map();
  }

  addRouter(name) {
    let router = new Router(name);
    this.routers.set(name, router);
  }

  addConnection(router1, router2, distance) {
    let n1 = this.routers.get(router1);
    let n2 = this.routers.get(router2);
    n1.connections.set(router2, distance);
    n2.connections.set(router1, distance);
  }

  
  getShortestPaths(startRouter){

    gsap.registerEffect({
      name: "swapText",
      effect: (targets, config) => {
        let tl = gsap.timeline({delay: config.delay});
        tl.to(targets, {opacity: 0, duration: config.duration / 2});
        tl.add(() => targets[0].innerHTML = config.text);
        tl.to(targets, {opacity: 1, duration: config.duration});
        return tl;
      },
      defaults: {duration: 1}, 
      extendTimeline: true
    });

    gsap.registerEffect({
      name: "text",
      effect: (targets, config) => {
        let tl = gsap.timeline({delay: config.delay});
        tl.to(targets, {opacity: 0, duration: config.duration / 2});
        tl.add(() => targets[0].innerHTML = config.text);
        tl.to(targets, {opacity: 1, duration: config.duration});
        return tl;
      },
      defaults: {duration: 0}, 
      extendTimeline: true
    });


    let distances = new Map();
    let visited = new Set();
    let queue = [startRouter];
    const parent = {};

    gsap.effects.swapText('#TDV'+ startRouter.name ,{text:'0'});
    gsap.effects.swapText('#TPV' + startRouter.name ,{text:'0'});
    gsap.effects.swapText("#SourceNode" , {text: startRouter.name });
  
    // Initialize distances to Infinity for all routers except startRouter and unconnected routers
    for (let router of this.routers.values()) {
      if (router === startRouter || router.connections.has(startRouter.name)) {
        distances.set(router.name, router === startRouter ? 0 : Infinity);
      } else {
        distances.set(router.name, Infinity);
      }
    }

    for (let router of this.routers.values()) {
      parent[router.name] = 0;
    };

    const firstloop = async () => {
      while (queue.length > 0) {
        let currentrouter = queue.shift();
        visited.add(currentrouter);
        
        // Update distances to neighboring routers
        const doSomething = async () => {
          for (let [routerName, distance] of currentrouter.connections) {
            let router = this.routers.get(routerName);
            if (!visited.has(router)) {
              let newDistance = distances.get(currentrouter.name) + distance;

              gsap.effects.text("#current-node" ,{text:currentrouter.name});
              gsap.effects.swapText("#neighbor-node",{text:routerName});
              gsap.effects.swapText("#currentNode" ,{text:currentrouter.name}); 
              gsap.effects.swapText("#neighborNode" ,{text:routerName});
              gsap.effects.swapText("#calculating-distance" ,{text: newDistance});

              let calcuate_distance;
              if(distances.get(routerName) == Infinity && newDistance != Infinity){
                 calcuate_distance = newDistance + ' < ' + '&#x221e <b style="color:crimson;"> [update!]</b>';
              } else if(newDistance < distances.get(routerName)){
                calcuate_distance = newDistance  + ' < ' + distances.get(routerName) + '<b style="color:crimson;"> [update!]</b>';
              } else{
                calcuate_distance = newDistance + ' < ' + distances.get(routerName)
              }
              
              gsap.effects.swapText("#calculating-distance2" ,{text: calcuate_distance });
              
              if (newDistance < distances.get(routerName)) {
                let elements;
                let vector;
                
                if((parent[routerName] != 0)){
                  console.log("here",routerName,parent[routerName]);
                  //console.log("yess");
                  elements = document.getElementsByClassName(routerName, parent[routerName]);
                  if (elements.length > 0) {  
                    vector = '.' + routerName + parent[routerName];
                   } else {
                    vector = '.'  + parent[routerName]  + routerName;
                  }
                  gsap.to(vector, {duration: 2, stroke: '#00527F'});
    
                }
    
                parent[routerName] = currentrouter.name;
                distances.set(routerName, newDistance);
                  
                elements = document.getElementsByClassName(routerName +currentrouter.name);
    
                if (elements.length > 0) {  
                  vector = '.' + routerName + currentrouter.name;
                } else {
                  vector = '.'  +currentrouter.name + routerName;
                }
      
                gsap.to(vector, {duration: 2, stroke: '#800000'});
                gsap.effects.swapText('#TDV'+ routerName, {text:newDistance});
                gsap.effects.swapText('#TPV' + routerName, {text:currentrouter.name});
          
              }

              if (!queue.includes(router)) {
                queue.push(router);
              }
            }
    
            await sleep(1000);
          }// for loop end
    
        }// do something end
        doSomething();
        await sleep(7000);
      }
      gsap.effects.swapText("#algo-finished" ,{text: '<b style="color:crimson; text-shadow: 2px 4px 4px rgba(46,91,173,0.6);"> Algorithm Completed!</b>' });
    }//firstloop end
    firstloop();
    return distances;
  } // end function
 


}

// Create a new graph
let graph = new Graph();

// Add routers to the graph
graph.addRouter("A");
graph.addRouter("B");
graph.addRouter("C");
graph.addRouter("D");
graph.addRouter("E");
graph.addRouter("F");

// Add connections to the graph, with distances
graph.addConnection("A", "B", 1);
graph.addConnection("A", "C", 4);
graph.addConnection("A", "D", Infinity);
graph.addConnection("A", "E", Infinity);
graph.addConnection("A", "F", Infinity);

graph.addConnection("B", "E", 7);
graph.addConnection("B", "D", 2);
graph.addConnection("B", "C", 4);
graph.addConnection("B", "F", Infinity);

graph.addConnection("C", "E", 5);
graph.addConnection("C", "D", 3);
graph.addConnection("C", "F", Infinity);

graph.addConnection("D", "E", 4);
graph.addConnection("D", "F", 6);

graph.addConnection("E", "F", 7);

console.log(graph);

function submit() {
  console.log("ABC");
  let radioOption = document.querySelector('input[type = radio]:checked').value;
  let shortestPathsFromA = graph.getShortestPaths(graph.routers.get(radioOption));
  console.log("Distances from router A:");
  for (let [routerName, distance] of shortestPathsFromA) {
    console.log(`  ${routerName}: ${distance === Infinity ? "Infinity" : distance}`);

    // -------------------- text ------------
    let myDiv = document.getElementById("des");
    myDiv.textContent = `Router ${radioOption} Final Routing Table`;

    // -------------------- table -----------
    let distances = graph.getShortestPaths(graph.routers.get(radioOption));
    
    // Select the table div container and remove any existing tables
    let tableDiv = document.getElementById("table-div");
    while (tableDiv.firstChild) {
      tableDiv.removeChild(tableDiv.firstChild);
    }

    // Create a new table and append it to the table div container
    let table = document.createElement("table");
    tableDiv.appendChild(table);

    // Create table header row
    let headerRow = table.insertRow();
    let headerRouterName = headerRow.insertCell();
    headerRouterName.textContent = "Router Name";
    let headerDistance = headerRow.insertCell();
    headerDistance.textContent = "Distance";

    // Add data rows to the table
    for (let [routerName, distance] of distances.entries()) {
      let row = table.insertRow();
      let routerNameCell = row.insertCell();
      routerNameCell.textContent = routerName;
      let distanceCell = row.insertCell();
      distanceCell.textContent = distance === Infinity ? "Unreachable" : distance;
    }
  }

}

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function refreshPage(){
  window.location.reload();
}