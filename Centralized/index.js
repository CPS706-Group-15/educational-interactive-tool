/* Dijkstra Algorithm -
    - takes graph: 
    - StartNode (source Node)
    - endNode (destination Node)

*/
function dijkstra(graph, startNode, endNode) {
  // register gsap effects
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
  for (let node in graph) {
    distances[node] = Infinity;
    gsap.effects.swapText('#TDV'+ node  ,{text:`&#x221e;`}); // changing visual
  }
  
  //initialize startNode to 0 as the distance of source node to itself is 0.
  distances[startNode] = 0;
    // Create an object to store the shortest path to each node
   const shortestPaths = {};
   // Create a priority queue to keep track of the next node to visit
   const queue = [startNode];

  // changing visual for startNode in parent and distances array 
  gsap.effects.swapText('#TDV'+ startNode ,{text:'0'});
  gsap.effects.swapText('#TPV' + startNode ,{text:'0'});
  
  // if source and destination is same, cost is 0, return
  if(startNode == endNode){
    let str = "Cost from " + startNode + " to " + endNode + " = 0"
    gsap.effects.swapText('#reasoning' ,{text:str});
    return;

  }

  const firstloop = async () => {
    while (queue.length > 0) {
   
        // Get the node with the smallest distance from the priority queue
        const currentNode = queue.shift();
      

        
  
        const doSomething = async () => {
          
          //iterate through each neighbor of the current node
          for (let neighbor in graph[currentNode]) {

              // Calculate the distance to the neighbor node
              const distance = distances[currentNode] + graph[currentNode][neighbor];
             
              //update explanation section
              gsap.effects.text("#current-node" ,{text:currentNode});
              gsap.effects.swapText("#neighbor-node",{text:neighbor});
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
                
                
                // If new shorest distance found, change link between nodes back to original as it is no longer part of the shortest path.
                if (shortestPaths[neighbor] != undefined){
                  
                  elements = document.getElementsByClassName( shortestPaths[neighbor] + neighbor);
                  if (elements.length > 0) {
                      vector = '.' + shortestPaths[neighbor] + neighbor;
                  } else {
                      vector = '.' + neighbor + shortestPaths[neighbor];
                  }
                  gsap.to(vector, {duration: 2, stroke: '#00527F'});

                }
                // update distance and shortest path structures.
                distances[neighbor] = distance;
                shortestPaths[neighbor] = currentNode;
                
                gsap.effects.swapText('#TDV'+ neighbor ,{text:distance});
                gsap.effects.swapText('#TPV' + neighbor ,{text:currentNode});
                
                
                // changing the color of the link between nodes
                elements = document.getElementsByClassName( neighbor + currentNode);
                if (elements.length > 0) {  
                    vector = '.' + neighbor + currentNode;
                } else {
                    vector = '.' + currentNode + neighbor;
                }
   
                gsap.to(vector, {duration: 2, stroke: '#800000'});
                
                // Add neighbor if not in queue already
                if (!queue.includes(neighbor)) {
                  queue.push(neighbor);
                }
              }


      

              await sleep(1000);
            }
        }
  
       doSomething();
       await sleep(7000);
      }
      
      // algorithm finished, inform user
      gsap.effects.swapText("#algo-finished" ,{text: '<b style="color:crimson; text-shadow: 2px 4px 4px rgba(46,91,173,0.6);"> Algorithm Completed!</b>' });
      finalPath(shortestPaths,endNode);

  }
  firstloop();
  return true;
  
  
 
}

// promise 
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}


//validate form before running algorithmn
function validateForm(graph){
  let startNode = document.forms["input-form"]["nm"].value.toUpperCase();
  let desNode = document.forms["input-form"]["des"].value.toUpperCase();
  let numRouters = document.forms["input-form"]["routers"].value;
  
  let pattern;
  switch(numRouters) {
    case '1':
      pattern = /^[Aa]$/i;
      break;
    case '2':
      pattern = /^[A-Ba-b]$/i;
      break;
    case '3':
      pattern = /^[A-Ca-c]$/i;
      break;
    case '4':
      pattern = /^[A-Da-d]$/i;
      break;
    case '5':
        pattern = /^[A-Ea-e]$/i;
        break;
    case '6':
        pattern = /^[A-Fa-f]$/i;
        break;
    case '6':
        pattern = /^[A-Ga-g]$/i;
        break;
    default:
      pattern = /^[A-Ga-g]$/i;
  }

  // source node and destination node must meet criteria.
  if( startNode.length == 1 && desNode.length == 1 && pattern.test(startNode) && pattern.test(desNode) ){
      document.getElementById("runAlgo").disabled = true;
      document.getElementById("setOptions").disabled = true;
      document.getElementById("routers").disabled = true;
     
      document.getElementsByClassName('container-weights')[0].style.display = 'none';
      document.getElementsByClassName('explanation')[0].style.display = 'block'; 
      dijkstra(graph, startNode, desNode);
           
  } 
  else{
      alert("Enter valid Source and Destination value.\nSource and Destination can not be the same.");
      return false;
  }
      
}
 
// GETS DATA STRUCTURE FOR CHOSEN GRAPH
function getGraph(numRouters){
    
    var sendGraph;
    switch(numRouters) {
      case '1': 
      sendGraph = {
        A: {},
      };
      break;
      case '2': 
      sendGraph = {
        A: { B: 2},
        B: { A: 2}
      };
        
        break;
      case '3':
        sendGraph = {
          A: { B: 8, C: 1},
          B: { A: 8, C: 2},
          C: { A: 1, B: 2}
    
        };
        break;
      
      case '4':
        sendGraph = {
          A: { B: 8, C: 1, D: 9},
          B: { A: 8, C: 1, D: 4},
          C: { A: 1, B: 1, D: 8},
          D: { A: 9, B: 4, C: 8}
         
        };
        break;

      case '5':
        sendGraph =  {
          A: { B: 8, C: 4, E: 2, D: 9},
          B: { A: 8, C: 4, E: 8},
          C: { A: 4, B: 4, D: 3},
          D: { A: 9, C: 3, E: 4},
          E: { A: 2, B: 8, D: 4}
         
        };
        break;
      case '6':
        sendGraph = {
          A: { B: 1, C: 4,},
          B: { A: 1, C: 4, D: 2, E: 7},
          C: { A: 4, B: 4, D: 3, E: 5},
          D: { B: 2, C: 3, E: 4, F: 6},
          E: { B: 7, C: 5, D: 4, F: 7},
          F: { D: 6, E: 7 }
        };
        break;
      
      case '7':
          sendGraph = {
            A: { B: 5, C: 2,},
            B: { A: 5, C: 4, E: 7},
            C: { A: 2, B: 4, D: 2, E: 5},
            D: { C: 2, F: 6},
            E: { B: 7, C: 5, F: 1, G: 2},
            F: { D: 6, E: 1, G: 3 },
            G: { E: 2, F:3}
          };
          break;

      
    }
  return sendGraph
    
}

// RESET THE PAGE
function refreshPage(){
  window.location.reload();
}

// OUTLINEs THE FINAL PATH FROM SOURCE TO DESTINATION ONLY
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

// GETTER: returns the edges in the graph
function getEdges(graph){
  let edges = []
  for (const [key, value] of Object.entries(graph)){
    for (const [key2, value2] of Object.entries(value))
        if(!(edges.includes(key+key2) || edges.includes(key2+key))){
          edges.push(key+key2);
        }
        
  }
  return edges;

}


//ALLOWS FOR WEIGHT CHANGE
function changeWeights(graph){

  //register GSAP effect
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


  // get the names of the edges in the network
  line = getEdges(graph);

 
  // for each edge, create a element div element for weight input
  for(element in line){
    attributes = {id: "edge"+line[element] , className:"cost-row"}
    

    var newNode = document.createElement('div');
    for (var prop in attributes) {
      newNode[prop] = attributes[prop];
    }
    
    var set = document.getElementById("weight-options").appendChild(newNode)

    var options = document.createElement('label')
    
    set.appendChild(options).appendChild(document.createTextNode("cost for node: "+ line[element]));
  
    var input = document.createElement('input')
    input.setAttribute("id", "cost" + line[element]);
    input.setAttribute("type","number");
    input.setAttribute("min","1");
    input.setAttribute("max","20");
    set.appendChild(input)
    
  
  }
  return line
  
}

//SETS OPTION, MAKES VISUAL CHANGES IN GRAPH
function setOptions(option){

  let numRouters = document.forms["input-form"]["routers"].value;
  let graph = getGraph(numRouters);
  let edges = getEdges(graph);

    //checks to see if user made changes to the link weights
    for(elements in edges){
    let line = edges[elements]
    let selection = document.getElementById("cost"+line).value //document.forms["Costs"]["edge"+line].value;
   
    if(selection != 0){
      if (option =="set"){
        gsap.effects.swapText('.W'+ edges[elements] ,{text:selection});
      }
      if (option =="run"){
        graph[line[0]][line[1]] = parseInt(selection);
        graph[line[1]][line[0]] = parseInt(selection);
      }
      
    }
    
  }
  if(option =="run"){validateForm(graph);}
  
}


// GETS THE GRAPH DEPENDING ON USER INPUT
function makeGraph(){
  let numRouters = document.forms["input-form"]["routers"].value;
  let vHTML = getRouterHTML(numRouters);
  document.getElementById("graph").innerHTML = vHTML;
  changeWeights(getGraph(numRouters));
  
}


// EVENT LISTENER FOR CHANGE IN ROUTER #
var activities = document.getElementById("routers");
activities.addEventListener("change", function() {
  document.getElementById("weight-options").innerHTML = "";
  makeGraph();
});






//SVG FOR THE DIFFERENT ROUTERS
function getRouterHTML(router) {

  let vHTML = "";
  
    if(router == 1){
        vHTML = `<svg class="network" width="180" height="111" viewBox="0 0 180 111" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 1">
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M24.0117 31.0983V77.5775H24.0254C24.0839 85.4775 35.8419 93.1617 56.8464 97.3961C88.2399 103.725 128.383 99.9571 146.508 88.9952C152.47 85.3893 155.304 81.4621 155.309 77.5775V31.2138C155.29 35.089 152.455 39.0058 146.508 42.6026C128.383 53.5645 88.2399 57.3179 56.8464 50.9891C35.7668 46.7395 24.0001 39.0281 24.0254 31.0983H24.0117Z" fill="url(#paint0_linear_120_1057)"/>
        <path id="path4755" d="M146.511 42.7711C142.202 45.3782 136.465 47.6635 129.627 49.4963C122.788 51.3292 114.983 52.6737 106.656 53.4531C98.3293 54.2324 89.6445 54.4314 81.0975 54.0387C72.5505 53.646 64.3088 52.6692 56.843 51.1641C49.3773 49.659 42.8338 47.6552 37.5862 45.267C32.3386 42.8788 28.4898 40.153 26.2595 37.2454C24.0291 34.3377 23.461 31.3052 24.5876 28.3208C25.7142 25.3365 28.5133 22.4589 32.8252 19.8524C37.134 17.2452 42.8714 14.9599 49.7099 13.1271C56.5483 11.2943 64.3537 9.94979 72.6804 9.1704C81.0071 8.39101 89.6919 8.192 98.2389 8.58474C106.786 8.97749 115.028 9.95428 122.493 11.4593C129.959 12.9644 136.503 14.9683 141.75 17.3565C146.998 19.7447 150.847 22.4704 153.077 25.3781C155.307 28.2857 155.875 31.3183 154.749 34.3026C153.622 37.2869 150.823 40.1645 146.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 29.5204L114.492 34.5044L143.702 40.393L138.208 43.7156L108.998 37.827L100.758 42.8109L95.2803 32.8464L122.733 29.5204Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 19.8126L70.3374 24.7965L41.1276 18.9079L35.6338 22.2305L64.8435 28.1191L56.6028 33.103L84.0555 29.7771L78.5781 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 45.2385L75.2147 42.9365L92.079 32.7371L84.4665 31.2025L67.6023 41.4019L56.1836 39.0999L61.9024 47.9184L86.6334 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 23.5238L111.733 21.2218L94.8693 31.4209L87.2568 29.8863L104.121 19.6872L92.702 17.3852L117.433 14.7051L123.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M88.2562 8.39837C66.0927 8.57177 44.7226 12.6657 32.828 19.8594C26.9552 23.4112 24.1154 27.276 24.0264 31.1039H24.0127V77.583H24.0264C24.0849 85.483 35.8428 93.1672 56.8474 97.4016C88.2409 103.73 128.384 99.9626 146.509 89.0008C152.471 85.3949 155.305 81.4677 155.31 77.583V31.3781C155.35 23.4433 143.582 15.7107 122.489 11.4585C111.698 9.28296 99.8657 8.30754 88.2562 8.39837Z" stroke="white"/>
        </g>
        <path id="A" d="M89.968 83.032H81.584L80.24 87H74.512L82.64 64.536H88.976L97.104 87H91.312L89.968 83.032ZM88.56 78.808L85.776 70.584L83.024 78.808H88.56Z" fill="#FBFFFE"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_120_1057" x1="24.0117" y1="65.7829" x2="155.309" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>`;
    }else if(router == 2){

        vHTML = `<svg  class="network" width="542" height="313" viewBox="0 0 542 313" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 2">
        <line class="AB" id="AB" x1="131.836" y1="85.9798" x2="400.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M24.0117 31.0983V77.5775H24.0254C24.0839 85.4775 35.8419 93.1617 56.8464 97.3961C88.2399 103.725 128.383 99.9571 146.508 88.9952C152.47 85.3893 155.304 81.4621 155.309 77.5775V31.2138C155.29 35.089 152.455 39.0058 146.508 42.6026C128.383 53.5645 88.2399 57.3179 56.8464 50.9891C35.7668 46.7395 24.0001 39.0281 24.0254 31.0983H24.0117Z" fill="url(#paint0_linear_117_742)"/>
        <path id="path4755" d="M146.511 42.7711C142.202 45.3782 136.465 47.6635 129.627 49.4963C122.788 51.3292 114.983 52.6737 106.656 53.4531C98.3293 54.2324 89.6445 54.4314 81.0975 54.0387C72.5505 53.646 64.3088 52.6692 56.843 51.1641C49.3773 49.659 42.8338 47.6552 37.5862 45.267C32.3386 42.8788 28.4898 40.153 26.2595 37.2454C24.0291 34.3377 23.461 31.3052 24.5876 28.3208C25.7142 25.3365 28.5133 22.4589 32.8252 19.8524C37.134 17.2452 42.8714 14.9599 49.7099 13.1271C56.5483 11.2943 64.3537 9.94979 72.6804 9.1704C81.0071 8.39101 89.692 8.192 98.2389 8.58474C106.786 8.97749 115.028 9.95428 122.493 11.4593C129.959 12.9644 136.503 14.9683 141.75 17.3565C146.998 19.7447 150.847 22.4704 153.077 25.3781C155.307 28.2857 155.875 31.3183 154.749 34.3026C153.622 37.2869 150.823 40.1645 146.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 29.5204L114.492 34.5044L143.702 40.393L138.208 43.7156L108.998 37.827L100.758 42.8109L95.2803 32.8464L122.733 29.5204Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 19.8126L70.3374 24.7965L41.1276 18.9079L35.6338 22.2305L64.8435 28.1191L56.6028 33.103L84.0555 29.7771L78.5781 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 45.2385L75.2147 42.9365L92.079 32.7371L84.4665 31.2025L67.6023 41.4019L56.1836 39.0999L61.9024 47.9184L86.6334 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 23.5238L111.733 21.2218L94.8693 31.4209L87.2568 29.8863L104.121 19.6872L92.702 17.3852L117.433 14.7051L123.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M88.2562 8.39837C66.0927 8.57177 44.7226 12.6657 32.828 19.8594C26.9552 23.4112 24.1154 27.276 24.0264 31.1039H24.0127V77.583H24.0264C24.0849 85.483 35.8428 93.1672 56.8474 97.4016C88.2409 103.73 128.384 99.9626 146.509 89.0008C152.471 85.3949 155.305 81.4677 155.31 77.583V31.3781C155.35 23.4433 143.582 15.7107 122.489 11.4585C111.698 9.28296 99.8657 8.30754 88.2562 8.39837Z" stroke="white"/>
        </g>
        <g id="RB">
        <g id="g3813_2">
        <path id="path3759_2" d="M386.012 233.098V279.578H386.025C386.084 287.477 397.842 295.162 418.846 299.396C450.24 305.725 490.383 301.957 508.508 290.995C514.47 287.389 517.304 283.462 517.309 279.578V233.214C517.29 237.089 514.455 241.006 508.508 244.603C490.383 255.565 450.24 259.318 418.846 252.989C397.767 248.74 386 241.028 386.025 233.098H386.012Z" fill="url(#paint1_linear_117_742)"/>
        <path id="path4755_2" d="M508.511 244.771C504.202 247.378 498.465 249.664 491.627 251.496C484.788 253.329 476.983 254.674 468.656 255.453C460.329 256.232 451.644 256.431 443.097 256.039C434.55 255.646 426.309 254.669 418.843 253.164C411.377 251.659 404.834 249.655 399.586 247.267C394.339 244.879 390.49 242.153 388.259 239.245C386.029 236.338 385.461 233.305 386.588 230.321C387.714 227.337 390.513 224.459 394.825 221.852C399.134 219.245 404.871 216.96 411.71 215.127C418.548 213.294 426.354 211.95 434.68 211.17C443.007 210.391 451.692 210.192 460.239 210.585C468.786 210.977 477.028 211.954 484.493 213.459C491.959 214.964 498.503 216.968 503.75 219.356C508.998 221.745 512.847 224.47 515.077 227.378C517.307 230.286 517.875 233.318 516.749 236.303C515.622 239.287 512.823 242.165 508.511 244.771Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M484.733 231.52L476.492 236.504L505.702 242.393L500.208 245.716L470.998 239.827L462.758 244.811L457.28 234.846L484.733 231.52Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M440.578 221.813L432.337 226.796L403.128 220.908L397.634 224.231L426.844 230.119L418.603 235.103L446.055 231.777L440.578 221.813Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M448.633 247.238L437.215 244.937L454.079 234.737L446.467 233.203L429.602 243.402L418.184 241.1L423.902 249.918L448.633 247.238Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M485.152 225.524L473.733 223.222L456.869 233.421L449.257 231.886L466.121 221.687L454.702 219.385L479.433 216.705L485.152 225.524Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M450.256 210.398C428.093 210.572 406.723 214.666 394.828 221.859C388.955 225.411 386.115 229.276 386.026 233.104H386.013V279.583H386.026C386.085 287.483 397.843 295.167 418.847 299.402C450.241 305.731 490.384 301.963 508.509 291.001C514.471 287.395 517.305 283.468 517.31 279.583V233.378C517.35 225.443 505.582 217.711 484.489 213.459C473.698 211.283 461.866 210.308 450.256 210.398Z" stroke="white"/>
        </g>
        <text id="B" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="449" y="289.2">B</tspan></text>
        <text id="A" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="74" y="87.2">A</tspan></text>
        <text id="AB2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAB" x="310" y="141.2">2</tspan></text>
        </g>
        <defs>
        <linearGradient id="paint0_linear_117_742" x1="24.0117" y1="65.7829" x2="155.309" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_117_742" x1="386.012" y1="267.783" x2="517.309" y2="267.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>
        `;
    }else if(router == 3){
        vHTML = `<svg class="network" width="895" height="313" viewBox="0 0 895 313" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 3">
        <line class="AC" id="AC" x1="136.088" y1="233.021" x2="450.088" y2="57.0215" stroke="#00527F" stroke-width="16"/>
        <line class="BC" id="BC" x1="139.975" y1="257" x2="768.975" y2="255" stroke="#00527F" stroke-width="16"/>
        <line class="AB" id="AB" x1="484.836" y1="85.9798" x2="753.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M377.012 31.0983V77.5775H377.025C377.084 85.4775 388.842 93.1617 409.846 97.3961C441.24 103.725 481.383 99.9571 499.508 88.9952C505.47 85.3893 508.304 81.4621 508.309 77.5775V31.2138C508.29 35.089 505.455 39.0058 499.508 42.6026C481.383 53.5645 441.24 57.3179 409.846 50.9891C388.767 46.7395 377 39.0281 377.025 31.0983H377.012Z" fill="url(#paint0_linear_117_702)"/>
        <path id="path4755" d="M499.511 42.7711C495.202 45.3782 489.465 47.6635 482.627 49.4963C475.788 51.3292 467.983 52.6737 459.656 53.4531C451.329 54.2324 442.644 54.4314 434.097 54.0387C425.55 53.646 417.309 52.6692 409.843 51.1641C402.377 49.659 395.834 47.6552 390.586 45.267C385.339 42.8788 381.49 40.153 379.259 37.2454C377.029 34.3377 376.461 31.3052 377.588 28.3208C378.714 25.3365 381.513 22.4589 385.825 19.8524C390.134 17.2452 395.871 14.9599 402.71 13.1271C409.548 11.2943 417.354 9.94979 425.68 9.1704C434.007 8.39101 442.692 8.192 451.239 8.58474C459.786 8.97749 468.028 9.95428 475.493 11.4593C482.959 12.9644 489.503 14.9683 494.75 17.3565C499.998 19.7447 503.847 22.4704 506.077 25.3781C508.307 28.2857 508.875 31.3183 507.749 34.3026C506.622 37.2869 503.823 40.1645 499.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M475.733 29.5204L467.492 34.5044L496.702 40.393L491.208 43.7156L461.998 37.827L453.758 42.8109L448.28 32.8464L475.733 29.5204Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M431.578 19.8126L423.337 24.7965L394.128 18.9079L388.634 22.2305L417.844 28.1191L409.603 33.103L437.055 29.7771L431.578 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M439.633 45.2385L428.215 42.9365L445.079 32.7371L437.467 31.2025L420.602 41.4019L409.184 39.0999L414.902 47.9184L439.633 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M476.152 23.5238L464.733 21.2218L447.869 31.4209L440.257 29.8863L457.121 19.6872L445.702 17.3852L470.433 14.7051L476.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M441.256 8.39837C419.093 8.57177 397.723 12.6657 385.828 19.8594C379.955 23.4112 377.115 27.276 377.026 31.1039H377.013V77.583H377.026C377.085 85.483 388.843 93.1672 409.847 97.4016C441.241 103.73 481.384 99.9626 499.509 89.0008C505.471 85.3949 508.305 81.4677 508.31 77.583V31.3781C508.35 23.4433 496.582 15.7107 475.489 11.4585C464.698 9.28296 452.866 8.30754 441.256 8.39837Z" stroke="white"/>
        </g>
        <g id="RC">
        <g id="g3813_2">
        <path id="path3759_2" d="M24.0117 230.098V276.578H24.0254C24.0839 284.477 35.8419 292.162 56.8464 296.396C88.2399 302.725 128.383 298.957 146.508 287.995C152.47 284.389 155.304 280.462 155.309 276.578V230.214C155.29 234.089 152.455 238.006 146.508 241.603C128.383 252.565 88.2399 256.318 56.8464 249.989C35.7668 245.74 24.0001 238.028 24.0254 230.098H24.0117Z" fill="url(#paint1_linear_117_702)"/>
        <path id="path4755_2" d="M146.511 241.771C142.202 244.378 136.465 246.664 129.627 248.496C122.788 250.329 114.983 251.674 106.656 252.453C98.3293 253.232 89.6445 253.431 81.0975 253.039C72.5505 252.646 64.3088 251.669 56.843 250.164C49.3773 248.659 42.8338 246.655 37.5862 244.267C32.3386 241.879 28.4898 239.153 26.2595 236.245C24.0291 233.338 23.461 230.305 24.5876 227.321C25.7142 224.337 28.5133 221.459 32.8252 218.852C37.134 216.245 42.8714 213.96 49.7099 212.127C56.5483 210.294 64.3537 208.95 72.6804 208.17C81.0071 207.391 89.692 207.192 98.2389 207.585C106.786 207.977 115.028 208.954 122.493 210.459C129.959 211.964 136.503 213.968 141.75 216.356C146.998 218.745 150.847 221.47 153.077 224.378C155.307 227.286 155.875 230.318 154.749 233.303C153.622 236.287 150.823 239.165 146.511 241.771Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 228.52L114.492 233.504L143.702 239.393L138.208 242.716L108.998 236.827L100.758 241.811L95.2803 231.846L122.733 228.52Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 218.813L70.3374 223.796L41.1276 217.908L35.6338 221.231L64.8435 227.119L56.6028 232.103L84.0555 228.777L78.5781 218.813Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 244.238L75.2147 241.937L92.079 231.737L84.4665 230.203L67.6023 240.402L56.1836 238.1L61.9024 246.918L86.6334 244.238Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 222.524L111.733 220.222L94.8693 230.421L87.2568 228.886L104.121 218.687L92.702 216.385L117.433 213.705L123.152 222.524Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M88.2562 207.398C66.0927 207.572 44.7226 211.666 32.828 218.859C26.9552 222.411 24.1154 226.276 24.0264 230.104H24.0127V276.583H24.0264C24.0849 284.483 35.8428 292.167 56.8474 296.402C88.2409 302.731 128.384 298.963 146.509 288.001C152.471 284.395 155.305 280.468 155.31 276.583V230.378C155.35 222.443 143.582 214.711 122.489 210.459C111.698 208.283 99.8657 207.308 88.2562 207.398Z" stroke="white"/>
        </g>
        <g id="RB">
        <g id="g3813_3">
        <path id="path3759_3" d="M739.012 233.098V279.578H739.025C739.084 287.477 750.842 295.162 771.846 299.396C803.24 305.725 843.383 301.957 861.508 290.995C867.47 287.389 870.304 283.462 870.309 279.578V233.214C870.29 237.089 867.455 241.006 861.508 244.603C843.383 255.565 803.24 259.318 771.846 252.989C750.767 248.74 739 241.028 739.025 233.098H739.012Z" fill="url(#paint2_linear_117_702)"/>
        <path id="path4755_3" d="M861.511 244.771C857.202 247.378 851.465 249.664 844.627 251.496C837.788 253.329 829.983 254.674 821.656 255.453C813.329 256.232 804.644 256.431 796.097 256.039C787.55 255.646 779.309 254.669 771.843 253.164C764.377 251.659 757.834 249.655 752.586 247.267C747.339 244.879 743.49 242.153 741.259 239.245C739.029 236.338 738.461 233.305 739.588 230.321C740.714 227.337 743.513 224.459 747.825 221.852C752.134 219.245 757.871 216.96 764.71 215.127C771.548 213.294 779.354 211.95 787.68 211.17C796.007 210.391 804.692 210.192 813.239 210.585C821.786 210.977 830.028 211.954 837.493 213.459C844.959 214.964 851.503 216.968 856.75 219.356C861.998 221.745 865.847 224.47 868.077 227.378C870.307 230.286 870.875 233.318 869.749 236.303C868.622 239.287 865.823 242.165 861.511 244.771Z" fill="#00527F"/>
        <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M837.733 231.52L829.492 236.504L858.702 242.393L853.208 245.716L823.998 239.827L815.758 244.811L810.28 234.846L837.733 231.52Z" fill="white"/>
        <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M793.578 221.813L785.337 226.796L756.128 220.908L750.634 224.231L779.844 230.119L771.603 235.103L799.055 231.777L793.578 221.813Z" fill="white"/>
        <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M801.633 247.238L790.215 244.937L807.079 234.737L799.467 233.203L782.602 243.402L771.184 241.1L776.902 249.918L801.633 247.238Z" fill="white"/>
        <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M838.152 225.524L826.733 223.222L809.869 233.421L802.257 231.886L819.121 221.687L807.702 219.385L832.433 216.705L838.152 225.524Z" fill="white"/>
        </g>
        <path id="path3798_3" d="M803.256 210.398C781.093 210.572 759.723 214.666 747.828 221.859C741.955 225.411 739.115 229.276 739.026 233.104H739.013V279.583H739.026C739.085 287.483 750.843 295.167 771.847 299.402C803.241 305.731 843.384 301.963 861.509 291.001C867.471 287.395 870.305 283.468 870.31 279.583V233.378C870.35 225.443 858.582 217.711 837.489 213.459C826.698 211.283 814.866 210.308 803.256 210.398Z" stroke="white"/>
        </g>
        <text id="B" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="802" y="289.2">B</tspan></text>
        <text id="C" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="74" y="287.2">C</tspan></text>
        <text id="A" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="427" y="87.2">A</tspan></text>
        <text id="AB8" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAB" x="663" y="141.2">8</tspan></text>
        <text id="AC1" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAC" x="234" y="135.2">1</tspan></text>
        <text id="BC2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBC" x="452" y="233.2">2</tspan></text>
        </g>
        <defs>
        <linearGradient id="paint0_linear_117_702" x1="377.012" y1="65.7829" x2="508.309" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_117_702" x1="24.0117" y1="264.783" x2="155.309" y2="264.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_117_702" x1="739.012" y1="267.783" x2="870.309" y2="267.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>`
    }else if(router == 4){
        vHTML = `
        <svg class="network" width="896" height="695" viewBox="0 0 896 695" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 4">
        <line class="AC" id="AC" x1="137.088" y1="233.021" x2="451.088" y2="57.0215" stroke="#00527F" stroke-width="16"/>
        <line class="BC" id="BC" x1="140.975" y1="257" x2="769.975" y2="255" stroke="#00527F" stroke-width="16"/>
        <line class="AD" id="AD" x1="134.067" y1="618.009" x2="442.067" y2="83.0086" stroke="#00527F" stroke-width="16"/>
        <line class="CD" id="CD" x1="90" y1="602.001" x2="89.9608" y2="283.002" stroke="#00527F" stroke-width="16"/>
        <line class="AB" id="AB" x1="485.836" y1="85.9798" x2="754.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <line class="BD" id="BD" x1="137.096" y1="639.017" x2="813.096" y2="261.017" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M378.012 31.0983V77.5775H378.025C378.084 85.4775 389.842 93.1617 410.846 97.3961C442.24 103.725 482.383 99.9571 500.508 88.9952C506.47 85.3893 509.304 81.4621 509.309 77.5775V31.2138C509.29 35.089 506.455 39.0058 500.508 42.6026C482.383 53.5645 442.24 57.3179 410.846 50.9891C389.767 46.7395 378 39.0281 378.025 31.0983H378.012Z" fill="url(#paint0_linear_115_647)"/>
        <path id="path4755" d="M500.511 42.7711C496.202 45.3782 490.465 47.6635 483.627 49.4963C476.788 51.3292 468.983 52.6737 460.656 53.4531C452.329 54.2324 443.644 54.4314 435.097 54.0387C426.55 53.646 418.309 52.6692 410.843 51.1641C403.377 49.659 396.834 47.6552 391.586 45.267C386.339 42.8788 382.49 40.153 380.259 37.2454C378.029 34.3377 377.461 31.3052 378.588 28.3208C379.714 25.3365 382.513 22.4589 386.825 19.8524C391.134 17.2452 396.871 14.9599 403.71 13.1271C410.548 11.2943 418.354 9.94979 426.68 9.1704C435.007 8.39101 443.692 8.192 452.239 8.58474C460.786 8.97749 469.028 9.95428 476.493 11.4593C483.959 12.9644 490.503 14.9683 495.75 17.3565C500.998 19.7447 504.847 22.4704 507.077 25.3781C509.307 28.2857 509.875 31.3183 508.749 34.3026C507.622 37.2869 504.823 40.1645 500.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M476.733 29.5204L468.492 34.5044L497.702 40.393L492.208 43.7156L462.998 37.827L454.758 42.8109L449.28 32.8464L476.733 29.5204Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M432.578 19.8126L424.337 24.7965L395.128 18.9079L389.634 22.2305L418.844 28.1191L410.603 33.103L438.055 29.7771L432.578 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M440.633 45.2385L429.215 42.9365L446.079 32.7371L438.467 31.2025L421.602 41.4019L410.184 39.0999L415.902 47.9184L440.633 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M477.152 23.5238L465.733 21.2218L448.869 31.4209L441.257 29.8863L458.121 19.6872L446.702 17.3852L471.433 14.7051L477.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M442.256 8.39837C420.093 8.57177 398.723 12.6657 386.828 19.8594C380.955 23.4112 378.115 27.276 378.026 31.1039H378.013V77.583H378.026C378.085 85.483 389.843 93.1672 410.847 97.4016C442.241 103.73 482.384 99.9626 500.509 89.0008C506.471 85.3949 509.305 81.4677 509.31 77.583V31.3781C509.35 23.4433 497.582 15.7107 476.489 11.4585C465.698 9.28296 453.866 8.30754 442.256 8.39837Z" stroke="white"/>
        </g>
        <g id="RC">
        <g id="g3813_2">
        <path id="path3759_2" d="M25.0117 230.098V276.578H25.0254C25.0839 284.477 36.8419 292.162 57.8464 296.396C89.2399 302.725 129.383 298.957 147.508 287.995C153.47 284.389 156.304 280.462 156.309 276.578V230.214C156.29 234.089 153.455 238.006 147.508 241.603C129.383 252.565 89.2399 256.318 57.8464 249.989C36.7668 245.74 25.0001 238.028 25.0254 230.098H25.0117Z" fill="url(#paint1_linear_115_647)"/>
        <path id="path4755_2" d="M147.511 241.771C143.202 244.378 137.465 246.664 130.627 248.496C123.788 250.329 115.983 251.674 107.656 252.453C99.3293 253.232 90.6445 253.431 82.0975 253.039C73.5505 252.646 65.3088 251.669 57.843 250.164C50.3773 248.659 43.8338 246.655 38.5862 244.267C33.3386 241.879 29.4898 239.153 27.2595 236.245C25.0291 233.338 24.461 230.305 25.5876 227.321C26.7142 224.337 29.5133 221.459 33.8252 218.852C38.134 216.245 43.8714 213.96 50.7099 212.127C57.5483 210.294 65.3537 208.95 73.6804 208.17C82.0071 207.391 90.6919 207.192 99.2389 207.585C107.786 207.977 116.028 208.954 123.493 210.459C130.959 211.964 137.503 213.968 142.75 216.356C147.998 218.745 151.847 221.47 154.077 224.378C156.307 227.286 156.875 230.318 155.749 233.303C154.622 236.287 151.823 239.165 147.511 241.771Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M123.733 228.52L115.492 233.504L144.702 239.393L139.208 242.716L109.998 236.827L101.758 241.811L96.2803 231.846L123.733 228.52Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M79.5781 218.813L71.3374 223.796L42.1276 217.908L36.6338 221.231L65.8435 227.119L57.6028 232.103L85.0555 228.777L79.5781 218.813Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M87.6334 244.238L76.2147 241.937L93.079 231.737L85.4665 230.203L68.6023 240.402L57.1836 238.1L62.9024 246.918L87.6334 244.238Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M124.152 222.524L112.733 220.222L95.8693 230.421L88.2568 228.886L105.121 218.687L93.702 216.385L118.433 213.705L124.152 222.524Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M89.2562 207.398C67.0927 207.572 45.7226 211.666 33.828 218.859C27.9552 222.411 25.1154 226.276 25.0264 230.104H25.0127V276.583H25.0264C25.0849 284.483 36.8428 292.167 57.8474 296.402C89.2409 302.731 129.384 298.963 147.509 288.001C153.471 284.395 156.305 280.468 156.31 276.583V230.378C156.35 222.443 144.582 214.711 123.489 210.459C112.698 208.283 100.866 207.308 89.2562 207.398Z" stroke="white"/>
        </g>
        <g id="RB">
        <g id="g3813_3">
        <path id="path3759_3" d="M740.012 233.098V279.578H740.025C740.084 287.477 751.842 295.162 772.846 299.396C804.24 305.725 844.383 301.957 862.508 290.995C868.47 287.389 871.304 283.462 871.309 279.578V233.214C871.29 237.089 868.455 241.006 862.508 244.603C844.383 255.565 804.24 259.318 772.846 252.989C751.767 248.74 740 241.028 740.025 233.098H740.012Z" fill="url(#paint2_linear_115_647)"/>
        <path id="path4755_3" d="M862.511 244.771C858.202 247.378 852.465 249.664 845.627 251.496C838.788 253.329 830.983 254.674 822.656 255.453C814.329 256.232 805.644 256.431 797.097 256.039C788.55 255.646 780.309 254.669 772.843 253.164C765.377 251.659 758.834 249.655 753.586 247.267C748.339 244.879 744.49 242.153 742.259 239.245C740.029 236.338 739.461 233.305 740.588 230.321C741.714 227.337 744.513 224.459 748.825 221.852C753.134 219.245 758.871 216.96 765.71 215.127C772.548 213.294 780.354 211.95 788.68 211.17C797.007 210.391 805.692 210.192 814.239 210.585C822.786 210.977 831.028 211.954 838.493 213.459C845.959 214.964 852.503 216.968 857.75 219.356C862.998 221.745 866.847 224.47 869.077 227.378C871.307 230.286 871.875 233.318 870.749 236.303C869.622 239.287 866.823 242.165 862.511 244.771Z" fill="#00527F"/>
        <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M838.733 231.52L830.492 236.504L859.702 242.393L854.208 245.716L824.998 239.827L816.758 244.811L811.28 234.846L838.733 231.52Z" fill="white"/>
        <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M794.578 221.813L786.337 226.796L757.128 220.908L751.634 224.231L780.844 230.119L772.603 235.103L800.055 231.777L794.578 221.813Z" fill="white"/>
        <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M802.633 247.238L791.215 244.937L808.079 234.737L800.467 233.203L783.602 243.402L772.184 241.1L777.902 249.918L802.633 247.238Z" fill="white"/>
        <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M839.152 225.524L827.733 223.222L810.869 233.421L803.257 231.886L820.121 221.687L808.702 219.385L833.433 216.705L839.152 225.524Z" fill="white"/>
        </g>
        <path id="path3798_3" d="M804.256 210.398C782.093 210.572 760.723 214.666 748.828 221.859C742.955 225.411 740.115 229.276 740.026 233.104H740.013V279.583H740.026C740.085 287.483 751.843 295.167 772.847 299.402C804.241 305.731 844.384 301.963 862.509 291.001C868.471 287.395 871.305 283.468 871.31 279.583V233.378C871.35 225.443 859.582 217.711 838.489 213.459C827.698 211.283 815.866 210.308 804.256 210.398Z" stroke="white"/>
        </g>
        <g id="RD">
        <g id="g3813_4">
        <path id="path3759_4" d="M24.0117 614.098V660.578H24.0254C24.0839 668.477 35.8419 676.162 56.8464 680.396C88.2399 686.725 128.383 682.957 146.508 671.995C152.47 668.389 155.304 664.462 155.309 660.578V614.214C155.29 618.089 152.455 622.006 146.508 625.603C128.383 636.565 88.2399 640.318 56.8464 633.989C35.7668 629.74 24.0001 622.028 24.0254 614.098H24.0117Z" fill="url(#paint3_linear_115_647)"/>
        <path id="path4755_4" d="M146.511 625.771C142.202 628.378 136.465 630.664 129.627 632.496C122.788 634.329 114.983 635.674 106.656 636.453C98.3293 637.232 89.6445 637.431 81.0975 637.039C72.5505 636.646 64.3088 635.669 56.843 634.164C49.3773 632.659 42.8338 630.655 37.5862 628.267C32.3386 625.879 28.4898 623.153 26.2595 620.245C24.0291 617.338 23.461 614.305 24.5876 611.321C25.7142 608.337 28.5133 605.459 32.8252 602.852C37.134 600.245 42.8714 597.96 49.7099 596.127C56.5483 594.294 64.3537 592.95 72.6804 592.17C81.0071 591.391 89.6919 591.192 98.2389 591.585C106.786 591.977 115.028 592.954 122.493 594.459C129.959 595.964 136.503 597.968 141.75 600.356C146.998 602.745 150.847 605.47 153.077 608.378C155.307 611.286 155.875 614.318 154.749 617.303C153.622 620.287 150.823 623.165 146.511 625.771Z" fill="#00527F"/>
        <path id="path2775_4" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 612.52L114.492 617.504L143.702 623.393L138.208 626.716L108.998 620.827L100.758 625.811L95.2803 615.846L122.733 612.52Z" fill="white"/>
        <path id="path4757_4" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 602.813L70.3374 607.796L41.1276 601.908L35.6338 605.231L64.8435 611.119L56.6028 616.103L84.0555 612.777L78.5781 602.813Z" fill="white"/>
        <path id="path4759_4" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 628.238L75.2147 625.937L92.079 615.737L84.4665 614.203L67.6023 624.402L56.1836 622.1L61.9024 630.918L86.6334 628.238Z" fill="white"/>
        <path id="path4761_4" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 606.524L111.733 604.222L94.8693 614.421L87.2568 612.886L104.121 602.687L92.702 600.385L117.433 597.705L123.152 606.524Z" fill="white"/>
        </g>
        <path id="path3798_4" d="M88.2562 591.398C66.0927 591.572 44.7226 595.666 32.828 602.859C26.9552 606.411 24.1154 610.276 24.0264 614.104H24.0127V660.583H24.0264C24.0849 668.483 35.8428 676.167 56.8474 680.402C88.2409 686.731 128.384 682.963 146.509 672.001C152.471 668.395 155.305 664.468 155.31 660.583V614.378C155.35 606.443 143.582 598.711 122.489 594.459C111.698 592.283 99.8657 591.308 88.2562 591.398Z" stroke="white"/>
        </g>
        <text id="B" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="803" y="289.2">B</tspan></text>
        <text id="C" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="75" y="287.2">C</tspan></text>
        <text id="D" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="74" y="671.2">D</tspan></text>
        <text id="A" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="428" y="87.2">A</tspan></text>
        <text id="AB8" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class ="WAB" x="664" y="141.2">8</tspan></text>
        <text id="CD8" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WCD"x="41" y="456.2">8</tspan></text>
        <text id="AC1" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class ="WAC" x="235" y="135.2">1</tspan></text>
        <text id="BC1" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class ="WBC" x="453" y="233.2">1</tspan></text>
        <text id="BD4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class ="WBD" x="482" y="485.2">4</tspan></text>
        <text id="AD9" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class ="WAD" x="281" y="406.2">9</tspan></text>
        </g>
        <defs>
        <linearGradient id="paint0_linear_115_647" x1="378.012" y1="65.7829" x2="509.309" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_115_647" x1="25.0117" y1="264.783" x2="156.309" y2="264.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_115_647" x1="740.012" y1="267.783" x2="871.309" y2="267.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint3_linear_115_647" x1="24.0117" y1="648.783" x2="155.309" y2="648.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>`;
    }else if(router == 5){
        vHTML = `<svg class="network" width="899" height="695" viewBox="0 0 899 695" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="GROUP 5">
        <line class="AC" id="AC" x1="137.088" y1="233.021" x2="451.088" y2="57.0215" stroke="#00527F" stroke-width="16"/>
        <line class="BC" id="BC" x1="140.975" y1="257" x2="769.975" y2="255" stroke="#00527F" stroke-width="16"/>
        <line class="AD" id="AD" x1="134.067" y1="618.009" x2="442.067" y2="83.0086" stroke="#00527F" stroke-width="16"/>
        <line class="DE" id="DE" x1="141" y1="641" x2="751" y2="641" stroke="#00527F" stroke-width="16"/>
        <line class="AE" id="AE" x1="454.858" y1="82.8803" x2="782.858" y2="628.88" stroke="#00527F" stroke-width="16"/>
        <line class="CD" id="CD" x1="90" y1="602.001" x2="89.9608" y2="283.002" stroke="#00527F" stroke-width="16"/>
        <line class="AB" id="AB" x1="485.836" y1="85.9798" x2="754.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <line class="BE" id="BE" x1="817.001" y1="607.1" x2="813.001" y2="288.1" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M378.012 31.0983V77.5775H378.026C378.084 85.4775 389.842 93.1617 410.847 97.3961C442.24 103.725 482.383 99.9571 500.508 88.9952C506.47 85.3893 509.304 81.4621 509.31 77.5775V31.2138C509.29 35.089 506.455 39.0058 500.508 42.6026C482.383 53.5645 442.24 57.3179 410.847 50.9891C389.767 46.7395 378.001 39.0281 378.026 31.0983H378.012Z" fill="url(#paint0_linear_115_578)"/>
        <path id="path4755" d="M500.511 42.7711C496.202 45.3782 490.465 47.6635 483.627 49.4963C476.788 51.3292 468.983 52.6737 460.656 53.4531C452.329 54.2324 443.644 54.4314 435.097 54.0387C426.55 53.646 418.309 52.6692 410.843 51.1641C403.377 49.659 396.834 47.6552 391.586 45.267C386.339 42.8788 382.49 40.153 380.259 37.2454C378.029 34.3377 377.461 31.3052 378.588 28.3208C379.714 25.3365 382.513 22.4589 386.825 19.8524C391.134 17.2452 396.871 14.9599 403.71 13.1271C410.548 11.2943 418.354 9.94979 426.68 9.1704C435.007 8.39101 443.692 8.192 452.239 8.58474C460.786 8.97749 469.028 9.95428 476.493 11.4593C483.959 12.9644 490.503 14.9683 495.75 17.3565C500.998 19.7447 504.847 22.4704 507.077 25.3781C509.307 28.2857 509.875 31.3183 508.749 34.3026C507.622 37.2869 504.823 40.1645 500.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M476.733 29.5204L468.492 34.5044L497.702 40.393L492.208 43.7156L462.998 37.827L454.758 42.8109L449.28 32.8464L476.733 29.5204Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M432.578 19.8126L424.337 24.7965L395.128 18.9079L389.634 22.2305L418.844 28.1191L410.603 33.103L438.055 29.7771L432.578 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M440.633 45.2385L429.215 42.9365L446.079 32.7371L438.467 31.2025L421.602 41.4019L410.184 39.0999L415.902 47.9184L440.633 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M477.152 23.5238L465.733 21.2218L448.869 31.4209L441.257 29.8863L458.121 19.6872L446.702 17.3852L471.433 14.7051L477.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M442.256 8.39837C420.093 8.57177 398.723 12.6657 386.828 19.8594C380.955 23.4112 378.115 27.276 378.026 31.1039H378.013V77.583H378.026C378.085 85.483 389.843 93.1672 410.847 97.4016C442.241 103.73 482.384 99.9626 500.509 89.0008C506.471 85.3949 509.305 81.4677 509.31 77.583V31.3781C509.35 23.4433 497.582 15.7107 476.489 11.4585C465.698 9.28296 453.866 8.30754 442.256 8.39837Z" stroke="white"/>
        </g>
        <g id="RC">
        <g id="g3813_2">
        <path id="path3759_2" d="M25.0122 230.098V276.578H25.0259C25.0844 284.477 36.8424 292.162 57.8469 296.396C89.2404 302.725 129.383 298.957 147.508 287.995C153.47 284.389 156.304 280.462 156.31 276.578V230.214C156.29 234.089 153.455 238.006 147.508 241.603C129.383 252.565 89.2404 256.318 57.8469 249.989C36.7673 245.74 25.0005 238.028 25.0259 230.098H25.0122Z" fill="url(#paint1_linear_115_578)"/>
        <path id="path4755_2" d="M147.511 241.771C143.202 244.378 137.465 246.664 130.627 248.496C123.788 250.329 115.983 251.674 107.656 252.453C99.3293 253.232 90.6445 253.431 82.0975 253.039C73.5505 252.646 65.3088 251.669 57.843 250.164C50.3773 248.659 43.8338 246.655 38.5862 244.267C33.3386 241.879 29.4898 239.153 27.2595 236.245C25.0291 233.338 24.461 230.305 25.5876 227.321C26.7142 224.337 29.5133 221.459 33.8252 218.852C38.134 216.245 43.8714 213.96 50.7099 212.127C57.5483 210.294 65.3537 208.95 73.6804 208.17C82.0071 207.391 90.692 207.192 99.2389 207.585C107.786 207.977 116.028 208.954 123.493 210.459C130.959 211.964 137.503 213.968 142.75 216.356C147.998 218.745 151.847 221.47 154.077 224.378C156.307 227.286 156.875 230.318 155.749 233.303C154.622 236.287 151.823 239.165 147.511 241.771Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M123.733 228.52L115.492 233.504L144.702 239.393L139.208 242.716L109.998 236.827L101.758 241.811L96.2803 231.846L123.733 228.52Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M79.5781 218.813L71.3374 223.796L42.1276 217.908L36.6338 221.231L65.8435 227.119L57.6028 232.103L85.0555 228.777L79.5781 218.813Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M87.6334 244.238L76.2147 241.937L93.079 231.737L85.4665 230.203L68.6023 240.402L57.1836 238.1L62.9024 246.918L87.6334 244.238Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M124.152 222.524L112.733 220.222L95.8693 230.421L88.2568 228.886L105.121 218.687L93.702 216.385L118.433 213.705L124.152 222.524Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M89.2562 207.398C67.0927 207.572 45.7226 211.666 33.828 218.859C27.9552 222.411 25.1154 226.276 25.0264 230.104H25.0127V276.583H25.0264C25.0849 284.483 36.8428 292.167 57.8474 296.402C89.2409 302.731 129.384 298.963 147.509 288.001C153.471 284.395 156.305 280.468 156.31 276.583V230.378C156.35 222.443 144.582 214.711 123.489 210.459C112.698 208.283 100.866 207.308 89.2562 207.398Z" stroke="white"/>
        </g>
        <g id="RB">
        <g id="g3813_3">
        <path id="path3759_3" d="M740.012 233.098V279.578H740.026C740.084 287.477 751.842 295.162 772.847 299.396C804.24 305.725 844.383 301.957 862.508 290.995C868.47 287.389 871.304 283.462 871.31 279.578V233.214C871.29 237.089 868.455 241.006 862.508 244.603C844.383 255.565 804.24 259.318 772.847 252.989C751.767 248.74 740.001 241.028 740.026 233.098H740.012Z" fill="url(#paint2_linear_115_578)"/>
        <path id="path4755_3" d="M862.511 244.771C858.202 247.378 852.465 249.664 845.627 251.496C838.788 253.329 830.983 254.674 822.656 255.453C814.329 256.232 805.644 256.431 797.097 256.039C788.55 255.646 780.309 254.669 772.843 253.164C765.377 251.659 758.834 249.655 753.586 247.267C748.339 244.879 744.49 242.153 742.259 239.245C740.029 236.338 739.461 233.305 740.588 230.321C741.714 227.337 744.513 224.459 748.825 221.852C753.134 219.245 758.871 216.96 765.71 215.127C772.548 213.294 780.354 211.95 788.68 211.17C797.007 210.391 805.692 210.192 814.239 210.585C822.786 210.977 831.028 211.954 838.493 213.459C845.959 214.964 852.503 216.968 857.75 219.356C862.998 221.745 866.847 224.47 869.077 227.378C871.307 230.286 871.875 233.318 870.749 236.303C869.622 239.287 866.823 242.165 862.511 244.771Z" fill="#00527F"/>
        <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M838.733 231.52L830.492 236.504L859.702 242.393L854.208 245.716L824.998 239.827L816.758 244.811L811.28 234.846L838.733 231.52Z" fill="white"/>
        <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M794.578 221.813L786.337 226.796L757.128 220.908L751.634 224.231L780.844 230.119L772.603 235.103L800.055 231.777L794.578 221.813Z" fill="white"/>
        <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M802.633 247.238L791.215 244.937L808.079 234.737L800.467 233.203L783.602 243.402L772.184 241.1L777.902 249.918L802.633 247.238Z" fill="white"/>
        <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M839.152 225.524L827.733 223.222L810.869 233.421L803.257 231.886L820.121 221.687L808.702 219.385L833.433 216.705L839.152 225.524Z" fill="white"/>
        </g>
        <path id="path3798_3" d="M804.256 210.398C782.093 210.572 760.723 214.666 748.828 221.859C742.955 225.411 740.115 229.276 740.026 233.104H740.013V279.583H740.026C740.085 287.483 751.843 295.167 772.847 299.402C804.241 305.731 844.384 301.963 862.509 291.001C868.471 287.395 871.305 283.468 871.31 279.583V233.378C871.35 225.443 859.582 217.711 838.489 213.459C827.698 211.283 815.866 210.308 804.256 210.398Z" stroke="white"/>
        </g>
        <g id="RE">
        <g id="g3813_4">
        <path id="path3759_4" d="M743.012 616.098V662.578H743.026C743.084 670.477 754.842 678.162 775.847 682.396C807.24 688.725 847.383 684.957 865.508 673.995C871.47 670.389 874.304 666.462 874.31 662.578V616.214C874.29 620.089 871.455 624.006 865.508 627.603C847.383 638.565 807.24 642.318 775.847 635.989C754.767 631.74 743.001 624.028 743.026 616.098H743.012Z" fill="url(#paint3_linear_115_578)"/>
        <path id="path4755_4" d="M865.511 627.771C861.202 630.378 855.465 632.664 848.627 634.496C841.788 636.329 833.983 637.674 825.656 638.453C817.329 639.232 808.644 639.431 800.097 639.039C791.55 638.646 783.309 637.669 775.843 636.164C768.377 634.659 761.834 632.655 756.586 630.267C751.339 627.879 747.49 625.153 745.259 622.245C743.029 619.338 742.461 616.305 743.588 613.321C744.714 610.337 747.513 607.459 751.825 604.852C756.134 602.245 761.871 599.96 768.71 598.127C775.548 596.294 783.354 594.95 791.68 594.17C800.007 593.391 808.692 593.192 817.239 593.585C825.786 593.977 834.028 594.954 841.493 596.459C848.959 597.964 855.503 599.968 860.75 602.356C865.998 604.745 869.847 607.47 872.077 610.378C874.307 613.286 874.875 616.318 873.749 619.303C872.622 622.287 869.823 625.165 865.511 627.771Z" fill="#00527F"/>
        <path id="path2775_4" fill-rule="evenodd" clip-rule="evenodd" d="M841.733 614.52L833.492 619.504L862.702 625.393L857.208 628.716L827.998 622.827L819.758 627.811L814.28 617.846L841.733 614.52Z" fill="white"/>
        <path id="path4757_4" fill-rule="evenodd" clip-rule="evenodd" d="M797.578 604.813L789.337 609.796L760.128 603.908L754.634 607.231L783.844 613.119L775.603 618.103L803.055 614.777L797.578 604.813Z" fill="white"/>
        <path id="path4759_4" fill-rule="evenodd" clip-rule="evenodd" d="M805.633 630.238L794.215 627.937L811.079 617.737L803.467 616.203L786.602 626.402L775.184 624.1L780.902 632.918L805.633 630.238Z" fill="white"/>
        <path id="path4761_4" fill-rule="evenodd" clip-rule="evenodd" d="M842.152 608.524L830.733 606.222L813.869 616.421L806.257 614.886L823.121 604.687L811.702 602.385L836.433 599.705L842.152 608.524Z" fill="white"/>
        </g>
        <path id="path3798_4" d="M807.256 593.398C785.093 593.572 763.723 597.666 751.828 604.859C745.955 608.411 743.115 612.276 743.026 616.104H743.013V662.583H743.026C743.085 670.483 754.843 678.167 775.847 682.402C807.241 688.731 847.384 684.963 865.509 674.001C871.471 670.395 874.305 666.468 874.31 662.583V616.378C874.35 608.443 862.582 600.711 841.489 596.459C830.698 594.283 818.866 593.308 807.256 593.398Z" stroke="white"/>
        </g>
        <g id="RD">
        <g id="g3813_5">
        <path id="path3759_5" d="M24.0122 614.098V660.578H24.0259C24.0844 668.477 35.8424 676.162 56.8469 680.396C88.2404 686.725 128.383 682.957 146.508 671.995C152.47 668.389 155.304 664.462 155.31 660.578V614.214C155.29 618.089 152.455 622.006 146.508 625.603C128.383 636.565 88.2404 640.318 56.8469 633.989C35.7673 629.74 24.0005 622.028 24.0259 614.098H24.0122Z" fill="url(#paint4_linear_115_578)"/>
        <path id="path4755_5" d="M146.511 625.771C142.202 628.378 136.465 630.664 129.627 632.496C122.788 634.329 114.983 635.674 106.656 636.453C98.3293 637.232 89.6445 637.431 81.0975 637.039C72.5505 636.646 64.3088 635.669 56.843 634.164C49.3773 632.659 42.8338 630.655 37.5862 628.267C32.3386 625.879 28.4898 623.153 26.2595 620.245C24.0291 617.338 23.461 614.305 24.5876 611.321C25.7142 608.337 28.5133 605.459 32.8252 602.852C37.134 600.245 42.8714 597.96 49.7099 596.127C56.5483 594.294 64.3537 592.95 72.6804 592.17C81.0071 591.391 89.692 591.192 98.2389 591.585C106.786 591.977 115.028 592.954 122.493 594.459C129.959 595.964 136.503 597.968 141.75 600.356C146.998 602.745 150.847 605.47 153.077 608.378C155.307 611.286 155.875 614.318 154.749 617.303C153.622 620.287 150.823 623.165 146.511 625.771Z" fill="#00527F"/>
        <path id="path2775_5" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 612.52L114.492 617.504L143.702 623.393L138.208 626.716L108.998 620.827L100.758 625.811L95.2803 615.846L122.733 612.52Z" fill="white"/>
        <path id="path4757_5" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 602.813L70.3374 607.796L41.1276 601.908L35.6338 605.231L64.8435 611.119L56.6028 616.103L84.0555 612.777L78.5781 602.813Z" fill="white"/>
        <path id="path4759_5" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 628.238L75.2147 625.937L92.079 615.737L84.4665 614.203L67.6023 624.402L56.1836 622.1L61.9024 630.918L86.6334 628.238Z" fill="white"/>
        <path id="path4761_5" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 606.524L111.733 604.222L94.8693 614.421L87.2568 612.886L104.121 602.687L92.702 600.385L117.433 597.705L123.152 606.524Z" fill="white"/>
        </g>
        <path id="path3798_5" d="M88.2562 591.398C66.0927 591.572 44.7226 595.666 32.828 602.859C26.9552 606.411 24.1154 610.276 24.0264 614.104H24.0127V660.583H24.0264C24.0849 668.483 35.8428 676.167 56.8474 680.402C88.2409 686.731 128.384 682.963 146.509 672.001C152.471 668.395 155.305 664.468 155.31 660.583V614.378C155.35 606.443 143.582 598.711 122.489 594.459C111.698 592.283 99.8657 591.308 88.2562 591.398Z" stroke="white"/>
        </g>
        <text id="B" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="803" y="289.2">B</tspan></text>
        <text id="C" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="75" y="287.2">C</tspan></text>
        <text id="E" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="802" y="670.2">E</tspan></text>
        <text id="D" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="74" y="671.2">D</tspan></text>
        <text id="A" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="428" y="87.2">A</tspan></text>
        <text id="AB8" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAB" x="664" y="141.2">8</tspan></text>
        <text id="CD3" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WCD" x="41" y="456.2">3</tspan></text>
        <text id="AC4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAC" x="235" y="135.2">4</tspan></text>
        <text id="BE8" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBE" x="843" y="463.2">8</tspan></text>
        <text id="AE2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAE" x="664" y="395.2">2</tspan></text>
        <text id="BC4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBC" x="453" y="233.2">4</tspan></text>
        <text id="DE4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WDE" x="442" y="619.2">4</tspan></text>
        <text id="AD9" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAD" x="281" y="406.2">9</tspan></text>
        </g>
        <defs>
        <linearGradient id="paint0_linear_115_578" x1="378.012" y1="65.7829" x2="509.31" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_115_578" x1="25.0122" y1="264.783" x2="156.31" y2="264.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_115_578" x1="740.012" y1="267.783" x2="871.31" y2="267.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint3_linear_115_578" x1="743.012" y1="650.783" x2="874.31" y2="650.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint4_linear_115_578" x1="24.0122" y1="648.783" x2="155.31" y2="648.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>
         `;
    }else if(router == 6){
        vHTML = `<svg class="network" width="899" height="914" viewBox="0 0 899 914" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 12">
        <line class="AC" id="AC" x1="137.088" y1="233.021" x2="451.088" y2="57.0215" stroke="#00527F" stroke-width="16"/>
        <line class="BC" id="BC" x1="140.975" y1="257" x2="769.975" y2="255" stroke="#00527F" stroke-width="16"/>
        <line class="BD" id="BD" x1="137.309" y1="614.902" x2="787.309" y2="276.902" stroke="#00527F" stroke-width="16"/>
        <line class="DE" id="DE" x1="141" y1="641" x2="751" y2="641" stroke="#00527F" stroke-width="16"/>
        <line class="CE" id="CE" x1="112.709" y1="276.912" x2="779.709" y2="625.912" stroke="#00527F" stroke-width="16"/>
        <line class="CD" id="CD" x1="90" y1="602.001" x2="89.9608" y2="283.002" stroke="#00527F" stroke-width="16"/>
        <line class="DF" id="DF" x1="97.2071" y1="664.196" x2="414.207" y2="860.196" stroke="#00527F" stroke-width="16"/>
        <line class="EF" id="EF" x1="795.443" y1="668.653" x2="506.443" y2="861.653" stroke="#00527F" stroke-width="16"/>
        <line class="AB" id="AB" x1="485.836" y1="85.9798" x2="754.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <line class="BE" id="BE" x1="817.001" y1="603.1" x2="813.001" y2="284.1" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M378.012 31.0983V77.5775H378.026C378.084 85.4775 389.842 93.1617 410.847 97.3961C442.24 103.725 482.383 99.9571 500.508 88.9952C506.47 85.3893 509.304 81.4621 509.31 77.5775V31.2138C509.29 35.089 506.455 39.0058 500.508 42.6026C482.383 53.5645 442.24 57.3179 410.847 50.9891C389.767 46.7395 378.001 39.0281 378.026 31.0983H378.012Z" fill="url(#paint0_linear_63_230)"/>
        <path id="path4755" d="M500.511 42.7711C496.202 45.3782 490.465 47.6635 483.627 49.4963C476.788 51.3292 468.983 52.6737 460.656 53.4531C452.329 54.2324 443.644 54.4314 435.097 54.0387C426.55 53.646 418.309 52.6692 410.843 51.1641C403.377 49.659 396.834 47.6552 391.586 45.267C386.339 42.8788 382.49 40.153 380.259 37.2454C378.029 34.3377 377.461 31.3052 378.588 28.3208C379.714 25.3365 382.513 22.4589 386.825 19.8524C391.134 17.2452 396.871 14.9599 403.71 13.1271C410.548 11.2943 418.354 9.94979 426.68 9.1704C435.007 8.39101 443.692 8.192 452.239 8.58474C460.786 8.97749 469.028 9.95428 476.493 11.4593C483.959 12.9644 490.503 14.9683 495.75 17.3565C500.998 19.7447 504.847 22.4704 507.077 25.3781C509.307 28.2857 509.875 31.3183 508.749 34.3026C507.622 37.2869 504.823 40.1645 500.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M476.733 29.5204L468.492 34.5044L497.702 40.393L492.208 43.7156L462.998 37.827L454.758 42.8109L449.28 32.8464L476.733 29.5204Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M432.578 19.8126L424.337 24.7965L395.128 18.9079L389.634 22.2305L418.844 28.1191L410.603 33.103L438.055 29.7771L432.578 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M440.633 45.2385L429.215 42.9365L446.079 32.7371L438.467 31.2025L421.602 41.4019L410.184 39.0999L415.902 47.9184L440.633 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M477.152 23.5238L465.733 21.2219L448.869 31.421L441.257 29.8863L458.121 19.6872L446.702 17.3852L471.433 14.7051L477.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M442.256 8.3984C420.093 8.5718 398.723 12.6657 386.828 19.8594C380.955 23.4112 378.115 27.2761 378.026 31.1039H378.013V77.5831H378.026C378.085 85.483 389.843 93.1673 410.847 97.4017C442.241 103.731 482.384 99.9627 500.509 89.0008C506.471 85.3949 509.305 81.4677 509.31 77.5831V31.3782C509.35 23.4433 497.582 15.7107 476.489 11.4585C465.698 9.28299 453.866 8.30757 442.256 8.3984Z" stroke="white"/>
        </g>
        <g id="RC">
        <g id="g3813_2">
        <path id="path3759_2" d="M25.0122 230.098V276.578H25.0259C25.0844 284.477 36.8424 292.162 57.8469 296.396C89.2404 302.725 129.383 298.957 147.508 287.995C153.47 284.389 156.304 280.462 156.31 276.578V230.214C156.29 234.089 153.455 238.006 147.508 241.603C129.383 252.565 89.2404 256.318 57.8469 249.989C36.7673 245.74 25.0005 238.028 25.0259 230.098H25.0122Z" fill="url(#paint1_linear_63_230)"/>
        <path id="path4755_2" d="M147.511 241.771C143.202 244.378 137.465 246.664 130.627 248.496C123.788 250.329 115.983 251.674 107.656 252.453C99.3293 253.232 90.6445 253.431 82.0975 253.039C73.5505 252.646 65.3088 251.669 57.843 250.164C50.3773 248.659 43.8338 246.655 38.5862 244.267C33.3386 241.879 29.4898 239.153 27.2595 236.245C25.0291 233.338 24.461 230.305 25.5876 227.321C26.7142 224.337 29.5133 221.459 33.8252 218.852C38.134 216.245 43.8714 213.96 50.7099 212.127C57.5483 210.294 65.3537 208.95 73.6804 208.17C82.0071 207.391 90.692 207.192 99.2389 207.585C107.786 207.977 116.028 208.954 123.493 210.459C130.959 211.964 137.503 213.968 142.75 216.356C147.998 218.745 151.847 221.47 154.077 224.378C156.307 227.286 156.875 230.318 155.749 233.303C154.622 236.287 151.823 239.165 147.511 241.771Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M123.733 228.52L115.492 233.504L144.702 239.393L139.208 242.716L109.998 236.827L101.758 241.811L96.2803 231.846L123.733 228.52Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M79.5781 218.813L71.3374 223.796L42.1276 217.908L36.6338 221.231L65.8435 227.119L57.6028 232.103L85.0555 228.777L79.5781 218.813Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M87.6334 244.238L76.2147 241.937L93.079 231.737L85.4665 230.203L68.6023 240.402L57.1836 238.1L62.9024 246.918L87.6334 244.238Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M124.152 222.524L112.733 220.222L95.8693 230.421L88.2568 228.886L105.121 218.687L93.702 216.385L118.433 213.705L124.152 222.524Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M89.256 207.398C67.0924 207.572 45.7223 211.666 33.8278 218.859C27.955 222.411 25.1151 226.276 25.0262 230.104H25.0125V276.583H25.0262C25.0846 284.483 36.8426 292.167 57.8471 296.402C89.2406 302.731 129.383 298.963 147.508 288.001C153.471 284.395 156.305 280.468 156.31 276.583V230.378C156.35 222.443 144.582 214.711 123.489 210.459C112.698 208.283 100.865 207.308 89.256 207.398Z" stroke="white"/>
        </g>
        <g id="RB">
        <g id="g3813_3">
        <path id="path3759_3" d="M740.012 233.098V279.578H740.026C740.084 287.477 751.842 295.162 772.847 299.396C804.24 305.725 844.383 301.957 862.508 290.995C868.47 287.389 871.304 283.462 871.31 279.578V233.214C871.29 237.089 868.455 241.006 862.508 244.603C844.383 255.565 804.24 259.318 772.847 252.989C751.767 248.74 740.001 241.028 740.026 233.098H740.012Z" fill="url(#paint2_linear_63_230)"/>
        <path id="path4755_3" d="M862.511 244.771C858.202 247.378 852.465 249.664 845.627 251.496C838.788 253.329 830.983 254.674 822.656 255.453C814.329 256.232 805.644 256.431 797.097 256.039C788.55 255.646 780.309 254.669 772.843 253.164C765.377 251.659 758.834 249.655 753.586 247.267C748.339 244.879 744.49 242.153 742.259 239.245C740.029 236.338 739.461 233.305 740.588 230.321C741.714 227.337 744.513 224.459 748.825 221.852C753.134 219.245 758.871 216.96 765.71 215.127C772.548 213.294 780.354 211.95 788.68 211.17C797.007 210.391 805.692 210.192 814.239 210.585C822.786 210.977 831.028 211.954 838.493 213.459C845.959 214.964 852.503 216.968 857.75 219.356C862.998 221.745 866.847 224.47 869.077 227.378C871.307 230.286 871.875 233.318 870.749 236.303C869.622 239.287 866.823 242.165 862.511 244.771Z" fill="#00527F"/>
        <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M838.733 231.52L830.492 236.504L859.702 242.393L854.208 245.716L824.998 239.827L816.758 244.811L811.28 234.846L838.733 231.52Z" fill="white"/>
        <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M794.578 221.813L786.337 226.796L757.128 220.908L751.634 224.231L780.844 230.119L772.603 235.103L800.055 231.777L794.578 221.813Z" fill="white"/>
        <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M802.633 247.238L791.215 244.937L808.079 234.737L800.467 233.203L783.602 243.402L772.184 241.1L777.902 249.918L802.633 247.238Z" fill="white"/>
        <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M839.152 225.524L827.733 223.222L810.869 233.421L803.257 231.886L820.121 221.687L808.702 219.385L833.433 216.705L839.152 225.524Z" fill="white"/>
        </g>
        <path id="path3798_3" d="M804.256 210.398C782.093 210.572 760.723 214.666 748.828 221.859C742.955 225.411 740.115 229.276 740.026 233.104H740.013V279.583H740.026C740.085 287.483 751.843 295.167 772.847 299.402C804.241 305.731 844.384 301.963 862.509 291.001C868.471 287.395 871.305 283.468 871.31 279.583V233.378C871.35 225.443 859.582 217.711 838.489 213.459C827.698 211.283 815.866 210.308 804.256 210.398Z" stroke="white"/>
        </g>
        <g id="RE">
        <g id="g3813_4">
        <path id="path3759_4" d="M743.012 616.098V662.578H743.026C743.084 670.477 754.842 678.162 775.847 682.396C807.24 688.725 847.383 684.957 865.508 673.995C871.47 670.389 874.304 666.462 874.31 662.578V616.214C874.29 620.089 871.455 624.006 865.508 627.603C847.383 638.565 807.24 642.318 775.847 635.989C754.767 631.74 743.001 624.028 743.026 616.098H743.012Z" fill="url(#paint3_linear_63_230)"/>
        <path id="path4755_4" d="M865.511 627.771C861.202 630.378 855.465 632.664 848.627 634.496C841.788 636.329 833.983 637.674 825.656 638.453C817.329 639.232 808.644 639.431 800.097 639.039C791.55 638.646 783.309 637.669 775.843 636.164C768.377 634.659 761.834 632.655 756.586 630.267C751.339 627.879 747.49 625.153 745.259 622.245C743.029 619.338 742.461 616.305 743.588 613.321C744.714 610.337 747.513 607.459 751.825 604.852C756.134 602.245 761.871 599.96 768.71 598.127C775.548 596.294 783.354 594.95 791.68 594.17C800.007 593.391 808.692 593.192 817.239 593.585C825.786 593.977 834.028 594.954 841.493 596.459C848.959 597.964 855.503 599.968 860.75 602.356C865.998 604.745 869.847 607.47 872.077 610.378C874.307 613.286 874.875 616.318 873.749 619.303C872.622 622.287 869.823 625.165 865.511 627.771Z" fill="#00527F"/>
        <path id="path2775_4" fill-rule="evenodd" clip-rule="evenodd" d="M841.733 614.52L833.492 619.504L862.702 625.393L857.208 628.716L827.998 622.827L819.758 627.811L814.28 617.846L841.733 614.52Z" fill="white"/>
        <path id="path4757_4" fill-rule="evenodd" clip-rule="evenodd" d="M797.578 604.813L789.337 609.796L760.128 603.908L754.634 607.231L783.844 613.119L775.603 618.103L803.055 614.777L797.578 604.813Z" fill="white"/>
        <path id="path4759_4" fill-rule="evenodd" clip-rule="evenodd" d="M805.633 630.238L794.215 627.937L811.079 617.737L803.467 616.203L786.602 626.402L775.184 624.1L780.902 632.918L805.633 630.238Z" fill="white"/>
        <path id="path4761_4" fill-rule="evenodd" clip-rule="evenodd" d="M842.152 608.524L830.733 606.222L813.869 616.421L806.257 614.886L823.121 604.687L811.702 602.385L836.433 599.705L842.152 608.524Z" fill="white"/>
        </g>
        <path id="path3798_4" d="M807.256 593.398C785.093 593.572 763.723 597.666 751.828 604.859C745.955 608.411 743.115 612.276 743.026 616.104H743.013V662.583H743.026C743.085 670.483 754.843 678.167 775.847 682.402C807.241 688.731 847.384 684.963 865.509 674.001C871.471 670.395 874.305 666.468 874.31 662.583V616.378C874.35 608.443 862.582 600.711 841.489 596.459C830.698 594.283 818.866 593.308 807.256 593.398Z" stroke="white"/>
        </g>
        <g id="RD">
        <g id="g3813_5">
        <path id="path3759_5" d="M24.0122 614.098V660.578H24.0259C24.0844 668.477 35.8424 676.162 56.8469 680.396C88.2404 686.725 128.383 682.957 146.508 671.995C152.47 668.389 155.304 664.462 155.31 660.578V614.214C155.29 618.089 152.455 622.006 146.508 625.603C128.383 636.565 88.2404 640.318 56.8469 633.989C35.7673 629.74 24.0005 622.028 24.0259 614.098H24.0122Z" fill="url(#paint4_linear_63_230)"/>
        <path id="path4755_5" d="M146.511 625.771C142.202 628.378 136.465 630.664 129.627 632.496C122.788 634.329 114.983 635.674 106.656 636.453C98.3293 637.232 89.6445 637.431 81.0975 637.039C72.5505 636.646 64.3088 635.669 56.843 634.164C49.3773 632.659 42.8338 630.655 37.5862 628.267C32.3386 625.879 28.4898 623.153 26.2595 620.245C24.0291 617.338 23.461 614.305 24.5876 611.321C25.7142 608.337 28.5133 605.459 32.8252 602.852C37.134 600.245 42.8714 597.96 49.7099 596.127C56.5483 594.294 64.3537 592.95 72.6804 592.17C81.0071 591.391 89.692 591.192 98.2389 591.585C106.786 591.977 115.028 592.954 122.493 594.459C129.959 595.964 136.503 597.968 141.75 600.356C146.998 602.745 150.847 605.47 153.077 608.378C155.307 611.286 155.875 614.318 154.749 617.303C153.622 620.287 150.823 623.165 146.511 625.771Z" fill="#00527F"/>
        <path id="path2775_5" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 612.52L114.492 617.504L143.702 623.393L138.208 626.716L108.998 620.827L100.758 625.811L95.2803 615.846L122.733 612.52Z" fill="white"/>
        <path id="path4757_5" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 602.813L70.3374 607.796L41.1276 601.908L35.6338 605.231L64.8435 611.119L56.6028 616.103L84.0555 612.777L78.5781 602.813Z" fill="white"/>
        <path id="path4759_5" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 628.238L75.2147 625.937L92.079 615.737L84.4665 614.203L67.6023 624.402L56.1836 622.1L61.9024 630.918L86.6334 628.238Z" fill="white"/>
        <path id="path4761_5" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 606.524L111.733 604.222L94.8693 614.421L87.2568 612.886L104.121 602.687L92.702 600.385L117.433 597.705L123.152 606.524Z" fill="white"/>
        </g>
        <path id="path3798_5" d="M88.256 591.398C66.0924 591.572 44.7223 595.666 32.8278 602.859C26.955 606.411 24.1151 610.276 24.0262 614.104H24.0125V660.583H24.0262C24.0846 668.483 35.8426 676.167 56.8471 680.402C88.2406 686.731 128.383 682.963 146.508 672.001C152.471 668.395 155.305 664.468 155.31 660.583V614.378C155.35 606.443 143.582 598.711 122.489 594.459C111.698 592.283 99.8655 591.308 88.256 591.398Z" stroke="white"/>
        </g>
        <g id="RF">
        <g id="g3813_6">
        <path id="path3759_6" d="M390.012 832.098V878.578H390.026C390.084 886.477 401.842 894.162 422.847 898.396C454.24 904.725 494.383 900.957 512.508 889.995C518.47 886.389 521.304 882.462 521.31 878.578V832.214C521.29 836.089 518.455 840.006 512.508 843.603C494.383 854.565 454.24 858.318 422.847 851.989C401.767 847.74 390.001 840.028 390.026 832.098H390.012Z" fill="url(#paint5_linear_63_230)"/>
        <path id="path4755_6" d="M512.511 843.771C508.202 846.378 502.465 848.664 495.627 850.496C488.788 852.329 480.983 853.674 472.656 854.453C464.329 855.232 455.644 855.431 447.097 855.039C438.55 854.646 430.309 853.669 422.843 852.164C415.377 850.659 408.834 848.655 403.586 846.267C398.339 843.879 394.49 841.153 392.259 838.245C390.029 835.338 389.461 832.305 390.588 829.321C391.714 826.337 394.513 823.459 398.825 820.852C403.134 818.245 408.871 815.96 415.71 814.127C422.548 812.294 430.354 810.95 438.68 810.17C447.007 809.391 455.692 809.192 464.239 809.585C472.786 809.977 481.028 810.954 488.493 812.459C495.959 813.964 502.503 815.968 507.75 818.356C512.998 820.745 516.847 823.47 519.077 826.378C521.307 829.286 521.875 832.318 520.749 835.303C519.622 838.287 516.823 841.165 512.511 843.771Z" fill="#00527F"/>
        <path id="path2775_6" fill-rule="evenodd" clip-rule="evenodd" d="M488.733 830.52L480.492 835.504L509.702 841.393L504.208 844.716L474.998 838.827L466.758 843.811L461.28 833.846L488.733 830.52Z" fill="white"/>
        <path id="path4757_6" fill-rule="evenodd" clip-rule="evenodd" d="M444.578 820.813L436.337 825.796L407.128 819.908L401.634 823.231L430.844 829.119L422.603 834.103L450.055 830.777L444.578 820.813Z" fill="white"/>
        <path id="path4759_6" fill-rule="evenodd" clip-rule="evenodd" d="M452.633 846.238L441.215 843.937L458.079 833.737L450.467 832.203L433.602 842.402L422.184 840.1L427.902 848.918L452.633 846.238Z" fill="white"/>
        <path id="path4761_6" fill-rule="evenodd" clip-rule="evenodd" d="M489.152 824.524L477.733 822.222L460.869 832.421L453.257 830.886L470.121 820.687L458.702 818.385L483.433 815.705L489.152 824.524Z" fill="white"/>
        </g>
        </g>
        <text id="B" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="803" y="289.2">B</tspan></text>
        <text id="C" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="75" y="287.2">C</tspan></text>
        <text id="E" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="802" y="670.2">E</tspan></text>
        <text id="D" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="74" y="671.2">D</tspan></text>
        <text id="A" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="428" y="87.2">A</tspan></text>
        <text id="F" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="444" y="890.2">F&#10;</tspan></text>
        <text id="AB1" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAB" x="664" y="141.2">1</tspan></text>
        <text id="BD3" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBD" x="41" y="456.2">3</tspan></text>
        <text id="AB4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAB" x="235" y="135.2">4</tspan></text>
        <text id="CE7" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WCE" x="843" y="463.2">7</tspan></text>
        <text id="EF7" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WEF" x="698" y="777.2">7</tspan></text>
        <text id="DF6" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WDF" x="216" y="801.2">6</tspan></text>
        <text id="CD2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WCD" x="586" y="360.2">2</tspan></text>
        <text id="BC4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBC" x="453" y="233.2">4</tspan></text>
        <text id="DE4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WDE" x="442" y="619.2">4</tspan></text>
        <text id="BE5" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBE" x="298" y="361.2">5</tspan></text>
        </g>
        <defs>
        <linearGradient id="paint0_linear_63_230" x1="378.012" y1="65.7829" x2="509.31" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_63_230" x1="25.0122" y1="264.783" x2="156.31" y2="264.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_63_230" x1="740.012" y1="267.783" x2="871.31" y2="267.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint3_linear_63_230" x1="743.012" y1="650.783" x2="874.31" y2="650.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint4_linear_63_230" x1="24.0122" y1="648.783" x2="155.31" y2="648.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint5_linear_63_230" x1="390.012" y1="866.783" x2="521.31" y2="866.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>
        `;
    }else if(router == 7){
      vHTML = `<svg  class="network" width="899" height="964" viewBox="0 0 899 964" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 7">
        <line class="AC" id="AC" x1="137.088" y1="233.021" x2="451.088" y2="57.0215" stroke="#00527F" stroke-width="16"/>
        <line class="BC" id="BC" x1="140.975" y1="257" x2="769.975" y2="255" stroke="#00527F" stroke-width="16"/>
        <line class="EF" id="EF" x1="227.602" y1="885.758" x2="747.602" y2="641.758" stroke="#00527F" stroke-width="16"/>
        <line class="FG" id="FG" x1="238.052" y1="885" x2="687.053" y2="887.928" stroke="#00527F" stroke-width="16"/>
        <line class="CE" id="CE" x1="112.709" y1="276.912" x2="779.709" y2="625.912" stroke="#00527F" stroke-width="16"/>
        <line class="CD" id="CD" x1="90" y1="602.001" x2="89.9608" y2="283.002" stroke="#00527F" stroke-width="16"/>
        <line class="DF" id="DF" x1="100.254" y1="667.628" x2="186.254" y2="852.628" stroke="#00527F" stroke-width="16"/>
        <line class="EG" id="EG" x1="798.379" y1="665.091" x2="705.379" y2="887.091" stroke="#00527F" stroke-width="16"/>
        <line class="AB" id="AB" x1="485.836" y1="85.9798" x2="754.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <line class="BE" id="BE" x1="817.001" y1="603.1" x2="813.001" y2="284.1" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M378.012 31.0984V77.5776H378.026C378.084 85.4775 389.842 93.1617 410.847 97.3962C442.24 103.725 482.383 99.9571 500.508 88.9953C506.47 85.3894 509.304 81.4622 509.31 77.5776V31.2139C509.29 35.089 506.455 39.0058 500.508 42.6027C482.383 53.5646 442.24 57.318 410.847 50.9892C389.767 46.7396 378.001 39.0282 378.026 31.0984H378.012Z" fill="url(#paint0_linear_118_874)"/>
        <path id="path4755" d="M500.511 42.7711C496.202 45.3782 490.465 47.6635 483.627 49.4963C476.788 51.3292 468.983 52.6737 460.656 53.4531C452.329 54.2324 443.644 54.4314 435.097 54.0387C426.55 53.646 418.309 52.6692 410.843 51.1641C403.377 49.659 396.834 47.6552 391.586 45.267C386.339 42.8788 382.49 40.153 380.259 37.2454C378.029 34.3377 377.461 31.3052 378.588 28.3208C379.714 25.3365 382.513 22.4589 386.825 19.8524C391.134 17.2452 396.871 14.9599 403.71 13.1271C410.548 11.2943 418.354 9.94979 426.68 9.1704C435.007 8.39101 443.692 8.192 452.239 8.58474C460.786 8.97749 469.028 9.95428 476.493 11.4593C483.959 12.9644 490.503 14.9683 495.75 17.3565C500.998 19.7447 504.847 22.4704 507.077 25.3781C509.307 28.2857 509.875 31.3183 508.749 34.3026C507.622 37.2869 504.823 40.1645 500.511 42.7711Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M476.733 29.5205L468.492 34.5044L497.702 40.393L492.208 43.7156L462.998 37.827L454.758 42.811L449.28 32.8464L476.733 29.5205Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M432.578 19.8126L424.337 24.7965L395.128 18.908L389.634 22.2306L418.844 28.1192L410.603 33.1031L438.055 29.7772L432.578 19.8126Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M440.633 45.2385L429.215 42.9365L446.079 32.7371L438.467 31.2025L421.602 41.4019L410.184 39.0999L415.902 47.9184L440.633 45.2385Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M477.152 23.5238L465.733 21.2218L448.869 31.4209L441.257 29.8863L458.121 19.6872L446.702 17.3852L471.433 14.7051L477.152 23.5238Z" fill="white"/>
        </g>
        <path id="path3798" d="M442.256 8.39837C420.093 8.57177 398.723 12.6657 386.828 19.8594C380.955 23.4112 378.115 27.276 378.026 31.1039H378.013V77.583H378.026C378.085 85.483 389.843 93.1672 410.847 97.4016C442.241 103.73 482.384 99.9626 500.509 89.0008C506.471 85.3949 509.305 81.4677 509.31 77.583V31.3781C509.35 23.4433 497.582 15.7107 476.489 11.4585C465.698 9.28296 453.866 8.30754 442.256 8.39837Z" stroke="white"/>
        </g>
        <g id="RC">
        <g id="g3813_2">
        <path id="path3759_2" d="M25.0122 230.098V276.578H25.0259C25.0844 284.478 36.8424 292.162 57.8469 296.396C89.2404 302.725 129.383 298.957 147.508 287.995C153.47 284.389 156.304 280.462 156.31 276.578V230.214C156.29 234.089 153.455 238.006 147.508 241.603C129.383 252.565 89.2404 256.318 57.8469 249.989C36.7673 245.74 25.0005 238.028 25.0259 230.098H25.0122Z" fill="url(#paint1_linear_118_874)"/>
        <path id="path4755_2" d="M147.511 241.771C143.202 244.378 137.465 246.664 130.627 248.496C123.788 250.329 115.983 251.674 107.656 252.453C99.3293 253.232 90.6445 253.431 82.0975 253.039C73.5505 252.646 65.3088 251.669 57.843 250.164C50.3773 248.659 43.8338 246.655 38.5862 244.267C33.3386 241.879 29.4898 239.153 27.2595 236.245C25.0291 233.338 24.461 230.305 25.5876 227.321C26.7142 224.337 29.5133 221.459 33.8252 218.852C38.134 216.245 43.8714 213.96 50.7099 212.127C57.5483 210.294 65.3537 208.95 73.6804 208.17C82.0071 207.391 90.692 207.192 99.2389 207.585C107.786 207.977 116.028 208.954 123.493 210.459C130.959 211.964 137.503 213.968 142.75 216.356C147.998 218.745 151.847 221.47 154.077 224.378C156.307 227.286 156.875 230.318 155.749 233.303C154.622 236.287 151.823 239.165 147.511 241.771Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M123.733 228.521L115.492 233.504L144.702 239.393L139.208 242.716L109.998 236.827L101.758 241.811L96.2803 231.846L123.733 228.521Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M79.5781 218.813L71.3374 223.797L42.1276 217.908L36.6338 221.231L65.8435 227.119L57.6028 232.103L85.0555 228.777L79.5781 218.813Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M87.6334 244.238L76.2147 241.937L93.079 231.737L85.4665 230.203L68.6023 240.402L57.1836 238.1L62.9024 246.918L87.6334 244.238Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M124.152 222.524L112.733 220.222L95.8693 230.421L88.2568 228.886L105.121 218.687L93.702 216.385L118.433 213.705L124.152 222.524Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M89.2562 207.398C67.0927 207.572 45.7226 211.666 33.828 218.859C27.9552 222.411 25.1154 226.276 25.0264 230.104H25.0127V276.583H25.0264C25.0849 284.483 36.8428 292.167 57.8474 296.402C89.2409 302.73 129.384 298.963 147.509 288.001C153.471 284.395 156.305 280.468 156.31 276.583V230.378C156.35 222.443 144.582 214.711 123.489 210.458C112.698 208.283 100.866 207.308 89.2562 207.398Z" stroke="white"/>
        </g>
        <g id="RB">
        <g id="g3813_3">
        <path id="path3759_3" d="M740.012 233.098V279.578H740.026C740.084 287.478 751.842 295.162 772.847 299.396C804.24 305.725 844.383 301.957 862.508 290.995C868.47 287.389 871.304 283.462 871.31 279.578V233.214C871.29 237.089 868.455 241.006 862.508 244.603C844.383 255.565 804.24 259.318 772.847 252.989C751.767 248.74 740.001 241.028 740.026 233.098H740.012Z" fill="url(#paint2_linear_118_874)"/>
        <path id="path4755_3" d="M862.511 244.771C858.202 247.378 852.465 249.664 845.627 251.496C838.788 253.329 830.983 254.674 822.656 255.453C814.329 256.232 805.644 256.431 797.097 256.039C788.55 255.646 780.309 254.669 772.843 253.164C765.377 251.659 758.834 249.655 753.586 247.267C748.339 244.879 744.49 242.153 742.259 239.245C740.029 236.338 739.461 233.305 740.588 230.321C741.714 227.337 744.513 224.459 748.825 221.852C753.134 219.245 758.871 216.96 765.71 215.127C772.548 213.294 780.354 211.95 788.68 211.17C797.007 210.391 805.692 210.192 814.239 210.585C822.786 210.977 831.028 211.954 838.493 213.459C845.959 214.964 852.503 216.968 857.75 219.356C862.998 221.745 866.847 224.47 869.077 227.378C871.307 230.286 871.875 233.318 870.749 236.303C869.622 239.287 866.823 242.165 862.511 244.771Z" fill="#00527F"/>
        <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M838.733 231.521L830.492 236.504L859.702 242.393L854.208 245.716L824.998 239.827L816.758 244.811L811.28 234.846L838.733 231.521Z" fill="white"/>
        <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M794.578 221.813L786.337 226.797L757.128 220.908L751.634 224.231L780.844 230.119L772.603 235.103L800.055 231.777L794.578 221.813Z" fill="white"/>
        <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M802.633 247.238L791.215 244.937L808.079 234.737L800.467 233.203L783.602 243.402L772.184 241.1L777.902 249.918L802.633 247.238Z" fill="white"/>
        <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M839.152 225.524L827.733 223.222L810.869 233.421L803.257 231.886L820.121 221.687L808.702 219.385L833.433 216.705L839.152 225.524Z" fill="white"/>
        </g>
        <path id="path3798_3" d="M804.256 210.398C782.093 210.572 760.723 214.666 748.828 221.859C742.955 225.411 740.115 229.276 740.026 233.104H740.013V279.583H740.026C740.085 287.483 751.843 295.167 772.847 299.402C804.241 305.73 844.384 301.963 862.509 291.001C868.471 287.395 871.305 283.468 871.31 279.583V233.378C871.35 225.443 859.582 217.711 838.489 213.458C827.698 211.283 815.866 210.308 804.256 210.398Z" stroke="white"/>
        </g>
        <g id="RE">
        <g id="g3813_4">
        <path id="path3759_4" d="M743.012 616.098V662.578H743.026C743.084 670.478 754.842 678.162 775.847 682.396C807.24 688.725 847.383 684.957 865.508 673.995C871.47 670.389 874.304 666.462 874.31 662.578V616.214C874.29 620.089 871.455 624.006 865.508 627.603C847.383 638.565 807.24 642.318 775.847 635.989C754.767 631.74 743.001 624.028 743.026 616.098H743.012Z" fill="url(#paint3_linear_118_874)"/>
        <path id="path4755_4" d="M865.511 627.771C861.202 630.378 855.465 632.664 848.627 634.496C841.788 636.329 833.983 637.674 825.656 638.453C817.329 639.232 808.644 639.431 800.097 639.039C791.55 638.646 783.309 637.669 775.843 636.164C768.377 634.659 761.834 632.655 756.586 630.267C751.339 627.879 747.49 625.153 745.259 622.245C743.029 619.338 742.461 616.305 743.588 613.321C744.714 610.337 747.513 607.459 751.825 604.852C756.134 602.245 761.871 599.96 768.71 598.127C775.548 596.294 783.354 594.95 791.68 594.17C800.007 593.391 808.692 593.192 817.239 593.585C825.786 593.977 834.028 594.954 841.493 596.459C848.959 597.964 855.503 599.968 860.75 602.356C865.998 604.745 869.847 607.47 872.077 610.378C874.307 613.286 874.875 616.318 873.749 619.303C872.622 622.287 869.823 625.165 865.511 627.771Z" fill="#00527F"/>
        <path id="path2775_4" fill-rule="evenodd" clip-rule="evenodd" d="M841.733 614.521L833.492 619.504L862.702 625.393L857.208 628.716L827.998 622.827L819.758 627.811L814.28 617.846L841.733 614.521Z" fill="white"/>
        <path id="path4757_4" fill-rule="evenodd" clip-rule="evenodd" d="M797.578 604.813L789.337 609.797L760.128 603.908L754.634 607.231L783.844 613.119L775.603 618.103L803.055 614.777L797.578 604.813Z" fill="white"/>
        <path id="path4759_4" fill-rule="evenodd" clip-rule="evenodd" d="M805.633 630.238L794.215 627.937L811.079 617.737L803.467 616.203L786.602 626.402L775.184 624.1L780.902 632.918L805.633 630.238Z" fill="white"/>
        <path id="path4761_4" fill-rule="evenodd" clip-rule="evenodd" d="M842.152 608.524L830.733 606.222L813.869 616.421L806.257 614.886L823.121 604.687L811.702 602.385L836.433 599.705L842.152 608.524Z" fill="white"/>
        </g>
        <path id="path3798_4" d="M807.256 593.398C785.093 593.572 763.723 597.666 751.828 604.859C745.955 608.411 743.115 612.276 743.026 616.104H743.013V662.583H743.026C743.085 670.483 754.843 678.167 775.847 682.402C807.241 688.73 847.384 684.963 865.509 674.001C871.471 670.395 874.305 666.468 874.31 662.583V616.378C874.35 608.443 862.582 600.711 841.489 596.458C830.698 594.283 818.866 593.308 807.256 593.398Z" stroke="white"/>
        </g>
        <g id="RD">
        <g id="g3813_5">
        <path id="path3759_5" d="M24.0122 614.098V660.578H24.0259C24.0844 668.478 35.8424 676.162 56.8469 680.396C88.2404 686.725 128.383 682.957 146.508 671.995C152.47 668.389 155.304 664.462 155.31 660.578V614.214C155.29 618.089 152.455 622.006 146.508 625.603C128.383 636.565 88.2404 640.318 56.8469 633.989C35.7673 629.74 24.0005 622.028 24.0259 614.098H24.0122Z" fill="url(#paint4_linear_118_874)"/>
        <path id="path4755_5" d="M146.511 625.771C142.202 628.378 136.465 630.664 129.627 632.496C122.788 634.329 114.983 635.674 106.656 636.453C98.3293 637.232 89.6445 637.431 81.0975 637.039C72.5505 636.646 64.3088 635.669 56.843 634.164C49.3773 632.659 42.8338 630.655 37.5862 628.267C32.3386 625.879 28.4898 623.153 26.2595 620.245C24.0291 617.338 23.461 614.305 24.5876 611.321C25.7142 608.337 28.5133 605.459 32.8252 602.852C37.134 600.245 42.8714 597.96 49.7099 596.127C56.5483 594.294 64.3537 592.95 72.6804 592.17C81.0071 591.391 89.692 591.192 98.2389 591.585C106.786 591.977 115.028 592.954 122.493 594.459C129.959 595.964 136.503 597.968 141.75 600.356C146.998 602.745 150.847 605.47 153.077 608.378C155.307 611.286 155.875 614.318 154.749 617.303C153.622 620.287 150.823 623.165 146.511 625.771Z" fill="#00527F"/>
        <path id="path2775_5" fill-rule="evenodd" clip-rule="evenodd" d="M122.733 612.521L114.492 617.504L143.702 623.393L138.208 626.716L108.998 620.827L100.758 625.811L95.2803 615.846L122.733 612.521Z" fill="white"/>
        <path id="path4757_5" fill-rule="evenodd" clip-rule="evenodd" d="M78.5781 602.813L70.3374 607.797L41.1276 601.908L35.6338 605.231L64.8435 611.119L56.6028 616.103L84.0555 612.777L78.5781 602.813Z" fill="white"/>
        <path id="path4759_5" fill-rule="evenodd" clip-rule="evenodd" d="M86.6334 628.238L75.2147 625.937L92.079 615.737L84.4665 614.203L67.6023 624.402L56.1836 622.1L61.9024 630.918L86.6334 628.238Z" fill="white"/>
        <path id="path4761_5" fill-rule="evenodd" clip-rule="evenodd" d="M123.152 606.524L111.733 604.222L94.8693 614.421L87.2568 612.886L104.121 602.687L92.702 600.385L117.433 597.705L123.152 606.524Z" fill="white"/>
        </g>
        <path id="path3798_5" d="M88.2562 591.398C66.0927 591.572 44.7226 595.666 32.828 602.859C26.9552 606.411 24.1154 610.276 24.0264 614.104H24.0127V660.583H24.0264C24.0849 668.483 35.8428 676.167 56.8474 680.402C88.2409 686.73 128.384 682.963 146.509 672.001C152.471 668.395 155.305 664.468 155.31 660.583V614.378C155.35 606.443 143.582 598.711 122.489 594.458C111.698 592.283 99.8657 591.308 88.2562 591.398Z" stroke="white"/>
        </g>
        <g id="RF">
        <g id="g3813_6">
        <path id="path3759_6" d="M150.012 864.098V910.578H150.026C150.084 918.477 161.842 926.162 182.847 930.396C214.24 936.725 254.383 932.957 272.508 921.995C278.47 918.389 281.304 914.462 281.31 910.578V864.214C281.29 868.089 278.455 872.006 272.508 875.603C254.383 886.565 214.24 890.318 182.847 883.989C161.767 879.74 150.001 872.028 150.026 864.098H150.012Z" fill="url(#paint5_linear_118_874)"/>
        <path id="path4755_6" d="M272.511 875.771C268.202 878.378 262.465 880.664 255.627 882.496C248.788 884.329 240.983 885.674 232.656 886.453C224.329 887.232 215.644 887.431 207.097 887.039C198.55 886.646 190.309 885.669 182.843 884.164C175.377 882.659 168.834 880.655 163.586 878.267C158.339 875.879 154.49 873.153 152.259 870.245C150.029 867.338 149.461 864.305 150.588 861.321C151.714 858.337 154.513 855.459 158.825 852.852C163.134 850.245 168.871 847.96 175.71 846.127C182.548 844.294 190.354 842.95 198.68 842.17C207.007 841.391 215.692 841.192 224.239 841.585C232.786 841.977 241.028 842.954 248.493 844.459C255.959 845.964 262.503 847.968 267.75 850.356C272.998 852.745 276.847 855.47 279.077 858.378C281.307 861.286 281.875 864.318 280.749 867.303C279.622 870.287 276.823 873.165 272.511 875.771Z" fill="#00527F"/>
        <path id="path2775_6" fill-rule="evenodd" clip-rule="evenodd" d="M248.733 862.52L240.492 867.504L269.702 873.393L264.208 876.716L234.998 870.827L226.758 875.811L221.28 865.846L248.733 862.52Z" fill="white"/>
        <path id="path4757_6" fill-rule="evenodd" clip-rule="evenodd" d="M204.578 852.813L196.337 857.796L167.128 851.908L161.634 855.231L190.844 861.119L182.603 866.103L210.055 862.777L204.578 852.813Z" fill="white"/>
        <path id="path4759_6" fill-rule="evenodd" clip-rule="evenodd" d="M212.633 878.238L201.215 875.937L218.079 865.737L210.467 864.203L193.602 874.402L182.184 872.1L187.902 880.918L212.633 878.238Z" fill="white"/>
        <path id="path4761_6" fill-rule="evenodd" clip-rule="evenodd" d="M249.152 856.524L237.733 854.222L220.869 864.421L213.257 862.886L230.121 852.687L218.702 850.385L243.433 847.705L249.152 856.524Z" fill="white"/>
        </g>
        </g>
        <g id="RG">
        <g id="g3813_7">
        <path id="path3759_7" d="M641.012 864.098V910.578H641.026C641.084 918.477 652.842 926.162 673.847 930.396C705.24 936.725 745.383 932.957 763.508 921.995C769.47 918.389 772.304 914.462 772.31 910.578V864.214C772.29 868.089 769.455 872.006 763.508 875.603C745.383 886.565 705.24 890.318 673.847 883.989C652.767 879.74 641.001 872.028 641.026 864.098H641.012Z" fill="url(#paint6_linear_118_874)"/>
        <path id="path4755_7" d="M763.511 875.771C759.202 878.378 753.465 880.664 746.627 882.496C739.788 884.329 731.983 885.674 723.656 886.453C715.329 887.232 706.644 887.431 698.097 887.039C689.55 886.646 681.309 885.669 673.843 884.164C666.377 882.659 659.834 880.655 654.586 878.267C649.339 875.879 645.49 873.153 643.259 870.245C641.029 867.338 640.461 864.305 641.588 861.321C642.714 858.337 645.513 855.459 649.825 852.852C654.134 850.245 659.871 847.96 666.71 846.127C673.548 844.294 681.354 842.95 689.68 842.17C698.007 841.391 706.692 841.192 715.239 841.585C723.786 841.977 732.028 842.954 739.493 844.459C746.959 845.964 753.503 847.968 758.75 850.356C763.998 852.745 767.847 855.47 770.077 858.378C772.307 861.286 772.875 864.318 771.749 867.303C770.622 870.287 767.823 873.165 763.511 875.771Z" fill="#00527F"/>
        <path id="path2775_7" fill-rule="evenodd" clip-rule="evenodd" d="M739.733 862.52L731.492 867.504L760.702 873.393L755.208 876.716L725.998 870.827L717.758 875.811L712.28 865.846L739.733 862.52Z" fill="white"/>
        <path id="path4757_7" fill-rule="evenodd" clip-rule="evenodd" d="M695.578 852.813L687.337 857.796L658.128 851.908L652.634 855.231L681.844 861.119L673.603 866.103L701.055 862.777L695.578 852.813Z" fill="white"/>
        <path id="path4759_7" fill-rule="evenodd" clip-rule="evenodd" d="M703.633 878.238L692.215 875.937L709.079 865.737L701.467 864.203L684.602 874.402L673.184 872.1L678.902 880.918L703.633 878.238Z" fill="white"/>
        <path id="path4761_7" fill-rule="evenodd" clip-rule="evenodd" d="M740.152 856.524L728.733 854.222L711.869 864.421L704.257 862.886L721.121 852.687L709.702 850.385L734.433 847.705L740.152 856.524Z" fill="white"/>
        </g>
        </g>
        <text id="B" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="803" y="289.2">B</tspan></text>
        <text id="C" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="75" y="287.2">C</tspan></text>
        <text id="E" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="802" y="670.2">E</tspan></text>
        <text id="D" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="74" y="671.2">D</tspan></text>
        <text id="A" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="428" y="87.2">A</tspan></text>
        <text id="F" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="203" y="916.2">F&#10;</tspan></text>
        <text id="G" fill="#FBFFFE" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan x="697" y="918.2">G</tspan></text>
        <text id="AB5" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAB" x="664" y="141.2">5</tspan></text>
        <text id="CD2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WCD" x="41" y="456.2">2</tspan></text>
        <text id="AC2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WAC" x="235" y="135.2">2</tspan></text>
        <text id="BE7" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBE" x="843" y="463.2">7</tspan></text>
        <text id="EG2" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WEG" x="782" y="792.2">2</tspan></text>
        <text id="DF6" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WDF" x="99" y="798.2">6</tspan></text>
        <text id="BC4" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WBC" x="453" y="233.2">4</tspan></text>
        <text id="EF1" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WEF" x="422" y="747.2">1</tspan></text>
        <text id="FG3" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WFG" x="460" y="940.2">3</tspan></text>
        <text id="CE5" fill="#00527F" xml:space="preserve" style="white-space: pre" font-family="Poppins" font-size="32" font-weight="bold" letter-spacing="0em"><tspan class="WCE" x="461" y="434.2">5</tspan></text>
        </g>
        <defs>
        <linearGradient id="paint0_linear_118_874" x1="378.012" y1="65.7829" x2="509.31" y2="65.7829" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_118_874" x1="25.0122" y1="264.783" x2="156.31" y2="264.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_118_874" x1="740.012" y1="267.783" x2="871.31" y2="267.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint3_linear_118_874" x1="743.012" y1="650.783" x2="874.31" y2="650.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint4_linear_118_874" x1="24.0122" y1="648.783" x2="155.31" y2="648.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint5_linear_118_874" x1="150.012" y1="898.783" x2="281.31" y2="898.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint6_linear_118_874" x1="641.012" y1="898.783" x2="772.31" y2="898.783" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>
        `
    }else{
        vHTML=`error`;
    }

    return vHTML;

}







