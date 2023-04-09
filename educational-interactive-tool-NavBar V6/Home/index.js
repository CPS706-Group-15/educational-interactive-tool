function dijkstra(graph, startNode) {
 
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
    gsap.effects.swapText("#SourceNode" , {text: startNode });
  
   
  
    
    

    const firstloop = async () => {
      
      while (queue.length > 0) {
     
          // Get the node with the smallest distance from the priority queue
          const currentNode = queue.shift();
          processed.push(currentNode);

          gsap.effects.swapText("#current-node" ,{text:currentNode});
          
          const doSomething = async () => {
            
      
            for (let neighbor in graph[currentNode]) {
                // Calculate the distance to the neighbor node
                if (!processed.includes(neighbor) ){
                  const distance = distances[currentNode] + graph[currentNode][neighbor];

                console.log(distances[neighbor]);
                gsap.effects.swapText("#neighbor-node" ,{text:neighbor});
                gsap.effects.swapText("#currentNode" ,{text:currentNode}); 
                gsap.effects.swapText("#neighborNode" ,{text:neighbor});

                gsap.effects.swapText("#calculating-distance" ,
                {text: distance});
               
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
                 gsap.effects.swapText("#calculating-distance2" ,
                 {text: calcuate_distance });

                //console.log('current', currentNode ,' distance: ', distance, ' neighbor: ', neighbor ,' parent: ', shortestPaths[neighbor] ,' distances[neighbor]:', distances[neighbor])

                // If the distance is shorter than the current shortest path to the neighbor node, update it
                if (distance < distances[neighbor]) {
                  
                  
                  if (shortestPaths[neighbor] != undefined){
                    
                    elements = document.getElementsByClassName( shortestPaths[neighbor] + neighbor);

                  if (elements.length > 0) {
                      //console.log("YES");
                      vector = '.' + shortestPaths[neighbor] + neighbor;
                  } else {
                      //console.log("NO");
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
                      //console.log("YES");
                      vector = '.' + neighbor + currentNode;
                  } else {
                      //console.log("NO");
                      vector = '.' + currentNode + neighbor;
                  }
     
                  gsap.to(vector, {duration: 2, stroke: '#800000'});
                
                  if (!queue.includes(neighbor)) {
                    queue.push(neighbor);
                  }
                }


                }
                
                
                
                
                
                
                await sleep(2000);
              }
          }
    
         doSomething();
         await sleep(8000);
        }
    }
    //document.getElementById("runAlgo").innerHTML = 'Reset';
    //document.getElementById("runAlgo").disabled = false;
    firstloop();
    
   
    
    //console.log(distances)
    //console.log(shortestPaths ) 
    //return { distances, shortestPaths };
  
    // Return an object containing the distances and shortest paths to each node
   
  }
  
  // Sample graph

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}



  


function validateForm(){
   

    let startNode = document.forms["myForm"]["nm"].value;

    const pattern = /^[A-Fa-f]$/i;

    if( startNode.length == 1 &&  pattern.test(startNode)){
        let input = document.forms["myForm"]["nm"].value; 
        
        dijkstra(getGraph(), input.toUpperCase());
        
        
        
    } 
    else{
        alert("Enter Valid Source");
        return false;
    }
        
}
 


  function getGraph(){
    const graph = {
      A: { B: 1, C: 4 },
      B: { A: 1, C: 4, D: 2 , E:7},
      C: { A: 4, B: 4, D: 3 , E:5},
      D: { B: 2, C: 3, E: 4 , F:6},
      E: { B: 7, C:5, D:4, F: 7},
      F: { D: 6, E: 7 }
    };

    return graph ;
  }


  function refreshGraph(){
    let graph = getGraph();
    
    for (let node in graph) {
      for (let neighbor in graph[node]) {
        elements = document.getElementsByClassName( node + neighbor);
        if (elements.length > 0) {
          //console.log("YES");
          vector = '.' + node + neighbor;
        } else {
          //console.log("NO");
          vector = '.' + neighbor+ node;
        }
        //gsap.to(vector, {duration: 0, stroke: '#00527F'});
        gsap.to(vector, {stroke: '#00527F'});
          
    }
    gsap.effects.swapText("#SourceNode" , {text: '' });
    gsap.effects.swapText("#neighbor-node" ,{text:''});
    gsap.effects.swapText("#currentNode" ,{text:''}); 
    gsap.effects.swapText("#neighborNode" ,{text:''});
  }
    
    

}

const refreshButton = document.getElementById("resetAlgo");

refreshButton.addEventListener("click",function(){
    location.reload();
});

function refreshPage(){
  window.location.reload();
}

  
  




