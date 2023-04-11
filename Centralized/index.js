function dijkstra(graph, startNode, endNode) {
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
    
    // Create an object to store the distances to each node and initialize them to Infinity
    const distances = {};
    const processed = [];
    for (let node in graph) {
      distances[node] = Infinity;
    }
    
      distances[startNode] = 0;
     // Create an object to store the shortest path to each node
     const shortestPaths = {};
     // Create a priority queue to keep track of the next node to visit
     const queue = [startNode];

    gsap.effects.swapText('#TDV'+ startNode ,{text:'0'});
    gsap.effects.swapText('#TPV' + startNode ,{text:'0'});
    //gsap.effects.swapText("#SourceNode" , {text: startNode });
  
    const firstloop = async () => {
      
      while (queue.length > 0) {
     
          // Get the node with the smallest distance from the priority queue
          const currentNode = queue.shift();
          processed.push(currentNode);

          
          
          const doSomething = async () => {
            
      
            for (let neighbor in graph[currentNode]) {
                // Calculate the distance to the neighbor node
               
                /* if (!processed.includes(neighbor) ){ */
                
                const distance = distances[currentNode] + graph[currentNode][neighbor];
                //console.log('currentNode: ', currentNode,' neighbor: ', neighbor, ' distance: ', distance, ' distances[neighbor]: ', distances[neighbor] )
                
                gsap.effects.text("#current-node" ,{text:currentNode});
                gsap.effects.swapText("#neighbor-node",{text:neighbor});
                //gsap.effects.swapText("#currentNode" ,{text:currentNode}); 
                //gsap.effects.swapText("#neighborNode" ,{text:neighbor});
                gsap.effects.swapText("#calculating-distance" ,{text: distance});
               
                //creating the string for updating the distance (text explanation)
                let calcuate_distance;
                if(distances[neighbor] == Infinity){
                   calcuate_distance = distance + ' < ' + '&#x221e <b style="color:crimson;"> [update!]</b>';
                }
                else if(distance < distances[neighbor]){
                  calcuate_distance = distance + ' < ' + distances[neighbor] + '<b style="color:crimson;"> [update!]</b>';
                }
                else{
                  calcuate_distance = distance + ' < ' + distances[neighbor]
                }
                gsap.effects.swapText("#calculating-distance2" ,{text: calcuate_distance });

               
                // If the distance is shorter than the current shortest path to the neighbor node, update it
                if (distance < distances[neighbor]) {
                  
                  
                  if (shortestPaths[neighbor] != undefined){
                    
                    elements = document.getElementsByClassName( shortestPaths[neighbor] + neighbor);

                    if (elements.length > 0) {
                        vector = '.' + shortestPaths[neighbor] + neighbor;
                    } else {
                        vector = '.' + neighbor + shortestPaths[neighbor];
                    }
                    gsap.to(vector, {duration: 2, stroke: '#00527F'});

                  }
                  distances[neighbor] = distance;
                  shortestPaths[neighbor] = currentNode;
                  
                  gsap.effects.swapText('#TDV'+ neighbor ,{text:distance});
                  gsap.effects.swapText('#TPV' + neighbor ,{text:currentNode});
                  
                  
                  elements = document.getElementsByClassName( neighbor + currentNode);

                  if (elements.length > 0) {  
                      vector = '.' + neighbor + currentNode;
                  } else {
                      vector = '.' + currentNode + neighbor;
                  }
     
                  gsap.to(vector, {duration: 2, stroke: '#800000'});
                
                  if (!queue.includes(neighbor)) {
                    queue.push(neighbor);
                  }
                }


                //}proces
 
                await sleep(1000);
              }
          }
    
         doSomething();
         await sleep(7000);
        }
        
        gsap.effects.swapText("#algo-finished" ,{text: '<b style="color:crimson; text-shadow: 2px 4px 4px rgba(46,91,173,0.6);"> Algorithm Completed!</b>' });
        finalPath(shortestPaths,endNode);

    }
    firstloop();
    
    
   
  }
  
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

function validateForm(){
   

    let startNode = document.forms["myForm"]["nm"].value.toUpperCase();
    let desNode = document.forms["myForm"]["des"].value.toUpperCase();
    
    
    const pattern = /^[A-Fa-f]$/i;

    if( startNode.length == 1 && desNode.length == 1 && pattern.test(startNode) && pattern.test(desNode) &&  (startNode != desNode)){
       
        document.getElementById("runAlgo").disabled = true;
        dijkstra(getGraph(), startNode, desNode);
              
    } 
    else{
        alert("Enter valid Source and Destination value [A-F].\nSource and Destination can not be the same.");
        return false;
    }
        
}
 
  function getGraph(){
    const graph = {
      A: { B: 3, C: 4, E: 4, D: 9},
      B: { A: 3, C: 2, E: 6},
      C: { A: 4, B: 2, D: 1},
      D: { A: 9, C: 1, E: 3, F: 7},
      E: { A: 4, B: 6, D: 3, F: 5},
      F: { D: 7, E: 5 }
    };

    return graph ;
  }


function refreshPage(){
  window.location.reload();
}


function finalPath(shortestPaths,endNode){
  final={};
  let parent = shortestPaths[endNode] ;
  final[endNode] = parent;
 
  while(parent != undefined){
    
    let node = shortestPaths[parent]
    final[parent] = node;
    parent = node;
  }

  for (const [key, value] of Object.entries(shortestPaths)) {
    if(!(key in final)){
      elements = document.getElementsByClassName(key + value);
      if (elements.length > 0) {
        vector = '.' + key + value;
      } else {
        vector = '.' + value + key;
      }
      gsap.to(vector, {duration: 0, stroke: '#00527F'});
    
    }
  }
}



