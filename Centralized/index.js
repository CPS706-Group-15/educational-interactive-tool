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



function validateForm(graph){
   

  let startNode = document.forms["input-form"]["nm"].value.toUpperCase();
  let desNode = document.forms["input-form"]["des"].value.toUpperCase();
  let numRouters = document.forms["input-form"]["routers"].value;
  
  const pattern = /^[A-Fa-f]$/i;

  if( startNode.length == 1 && desNode.length == 1 && pattern.test(startNode) && pattern.test(desNode) &&  (startNode != desNode)){
     
      document.getElementById("runAlgo").disabled = true;
      console.log('validate ', graph); 
      console.log('validate ', startNode); 
      console.log('validate ', desNode);
      document.getElementById("setOptions").disabled = true;
      console.log(document.getElementsByClassName('weightsbox'));
      console.log(document.getElementsByClassName('explanation'));
      
      document.getElementsByClassName('container-weights')[0].style.display = 'none';
      document.getElementsByClassName('explanation')[0].style.display = 'block'; 
      dijkstra(graph, startNode, desNode);
            
  } 
  else{
      alert("Enter valid Source and Destination value [A-F].\nSource and Destination can not be the same.");
      return false;
  }
      
}
 
  function getGraph(numRouters){
    
    var sendGraph;
    switch(numRouters) {
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
          A: { B: 3, C: 4, E: 4, D: 9},
          B: { A: 3, C: 2, E: 6},
          C: { A: 4, B: 2, D: 1},
          D: { A: 9, C: 1, E: 3, F: 7},
          E: { A: 4, B: 6, D: 3, F: 5},
          F: { D: 7, E: 5 }
        };
        break;

      
    }
  return sendGraph
    
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





function changeWeights(graph){
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
  
  line = getEdges(graph);
  //console.log(line)
  for(var element in line){
    console.log(line[element]);
  }
  for(element in line){
    attributes = {id: "edge"+line[element] , className:"custom-select mr-sm-2", style:"margin:3px;"}
    

    var newNode = document.createElement('select');
    for (var prop in attributes) {
      newNode[prop] = attributes[prop];
    }

    
    var set = document.getElementById("weight-options").appendChild(newNode)

    
    set.setAttribute("onchange",  onSelection("did you get there"));
    var options = document.createElement('option')
    options.setAttribute("value", 0);
    options.setAttribute("className", "option0");
    set.appendChild(options).appendChild(document.createTextNode("choose cost for node: "+ line[element]));
  

    for(var i=1; i <= 9; i++){
      var options = document.createElement('option')
      options.setAttribute("value", i);
      options.setAttribute("className", "option"+i);
     
      //options.innerHTML(i);
     
      set.appendChild(options).appendChild(document.createTextNode(i));
      


    }
    
  
  }
  return line
  
}

function setOptions(option){
  console.log("here");
  let numRouters = document.forms["input-form"]["routers"].value;
  let graph = getGraph(numRouters);
  let edges = getEdges(graph);
  console.log(edges)
    
    for(elements in edges){
    let line = edges[elements]
    let selection = document.forms["weight-form"]["edge"+line].value;
   
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
 
  //return graph;


  
  
 
}

function updateGraph(graph){
  for (const [key, value] of Object.entries(graph)){
    console.log(key,value)
  }
}

function makeGraph(){
  let numRouters = document.forms["input-form"]["routers"].value;
  let vHTML = getRouterHTML(numRouters);
  document.getElementById("graph").innerHTML = vHTML;
  changeWeights(getGraph(numRouters));
  
}

var activities = document.getElementById("routers");
activities.addEventListener("change", function() {

  document.getElementById("weight-options").innerHTML = "";
  makeGraph();
});



function onSelection(input){
  console.log('in here', input);
}




function getRouterHTML(router) {
  console.log("in this function", router);
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
    }
    else if(router == 2){
        console.log("here");
        vHTML = `<svg class="network" width="542" height="313" viewBox="0 0 542 313" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 2">
        <line class="AB" id="AB" x1="131.836" y1="85.9798" x2="400.836" y2="232.98" stroke="#00527F" stroke-width="16"/>
        <g id="RA">
        <g id="g3813">
        <path id="path3759" d="M24.0117 31.0983V77.5775H24.0254C24.0839 85.4775 35.8419 93.1617 56.8464 97.3961C88.2399 103.725 128.383 99.9571 146.508 88.9952C152.47 85.3893 155.304 81.4621 155.309 77.5775V31.2138C155.29 35.089 152.455 39.0058 146.508 42.6026C128.383 53.5645 88.2399 57.3179 56.8464 50.9891C35.7668 46.7395 24.0001 39.0281 24.0254 31.0983H24.0117Z" fill="url(#paint0_linear_117_742)"/>
        <path id="path4755" d="M146.511 42.7711C142.202 45.3782 136.465 47.6635 129.627 49.4963C122.788 51.3292 114.983 52.6737 106.656 53.4531C98.3293 54.2324 89.6445 54.4314 81.0975 54.0387C72.5505 53.646 64.3088 52.6692 56.843 51.1641C49.3773 49.659 42.8338 47.6552 37.5862 45.267C32.3386 42.8788 28.4898 40.153 26.2595 37.2454C24.0291 34.3377 23.461 31.3052 24.5876 28.3208C25.7142 25.3365 28.5133 22.4589 32.8252 19.8524C37.134 17.2452 42.8714 14.9599 49.7099 13.1271C56.5483 11.2943 64.3537 9.94979 72.6804 9.1704C81.0071 8.39101 89.6919 8.192 98.2389 8.58474C106.786 8.97749 115.028 9.95428 122.493 11.4593C129.959 12.9644 136.503 14.9683 141.75 17.3565C146.998 19.7447 150.847 22.4704 153.077 25.3781C155.307 28.2857 155.875 31.3183 154.749 34.3026C153.622 37.2869 150.823 40.1645 146.511 42.7711Z" fill="#00527F"/>
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
        <path id="B" d="M464.584 277.48C465.885 277.757 466.931 278.408 467.72 279.432C468.509 280.435 468.904 281.587 468.904 282.888C468.904 284.765 468.243 286.259 466.92 287.368C465.619 288.456 463.795 289 461.448 289H450.984V266.536H461.096C463.379 266.536 465.16 267.059 466.44 268.104C467.741 269.149 468.392 270.568 468.392 272.36C468.392 273.683 468.04 274.781 467.336 275.656C466.653 276.531 465.736 277.139 464.584 277.48ZM456.456 275.624H460.04C460.936 275.624 461.619 275.432 462.088 275.048C462.579 274.643 462.824 274.056 462.824 273.288C462.824 272.52 462.579 271.933 462.088 271.528C461.619 271.123 460.936 270.92 460.04 270.92H456.456V275.624ZM460.488 284.584C461.405 284.584 462.109 284.381 462.6 283.976C463.112 283.549 463.368 282.941 463.368 282.152C463.368 281.363 463.101 280.744 462.568 280.296C462.056 279.848 461.341 279.624 460.424 279.624H456.456V284.584H460.488Z" fill="#FBFFFE"/>
        <path id="A" d="M89.968 83.032H81.584L80.24 87H74.512L82.64 64.536H88.976L97.104 87H91.312L89.968 83.032ZM88.56 78.808L85.776 70.584L83.024 78.808H88.56Z" fill="#FBFFFE"/>
        <path id="AB2" d="M311.248 136.616C311.973 136.04 312.304 135.773 312.24 135.816C314.331 134.088 315.973 132.669 317.168 131.56C318.384 130.451 319.408 129.288 320.24 128.072C321.072 126.856 321.488 125.672 321.488 124.52C321.488 123.645 321.285 122.963 320.88 122.472C320.475 121.981 319.867 121.736 319.056 121.736C318.245 121.736 317.605 122.045 317.136 122.664C316.688 123.261 316.464 124.115 316.464 125.224H311.184C311.227 123.411 311.611 121.896 312.336 120.68C313.083 119.464 314.053 118.568 315.248 117.992C316.464 117.416 317.808 117.128 319.28 117.128C321.819 117.128 323.728 117.779 325.008 119.08C326.309 120.381 326.96 122.077 326.96 124.168C326.96 126.451 326.181 128.573 324.624 130.536C323.067 132.477 321.083 134.376 318.672 136.232H327.312V140.68H311.248V136.616Z" fill="#00527F"/>
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
        </svg>`;
    }
    else if(router == 3){
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
          <path id="path4755_2" d="M146.511 241.771C142.202 244.378 136.465 246.664 129.627 248.496C122.788 250.329 114.983 251.674 106.656 252.453C98.3293 253.232 89.6445 253.431 81.0975 253.039C72.5505 252.646 64.3088 251.669 56.843 250.164C49.3773 248.659 42.8338 246.655 37.5862 244.267C32.3386 241.879 28.4898 239.153 26.2595 236.245C24.0291 233.338 23.461 230.305 24.5876 227.321C25.7142 224.337 28.5133 221.459 32.8252 218.852C37.134 216.245 42.8714 213.96 49.7099 212.127C56.5483 210.294 64.3537 208.95 72.6804 208.17C81.0071 207.391 89.6919 207.192 98.2389 207.585C106.786 207.977 115.028 208.954 122.493 210.459C129.959 211.964 136.503 213.968 141.75 216.356C146.998 218.745 150.847 221.47 153.077 224.378C155.307 227.286 155.875 230.318 154.749 233.303C153.622 236.287 150.823 239.165 146.511 241.771Z" fill="#00527F"/>
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
          <path id="B" d="M817.584 277.48C818.885 277.757 819.931 278.408 820.72 279.432C821.509 280.435 821.904 281.587 821.904 282.888C821.904 284.765 821.243 286.259 819.92 287.368C818.619 288.456 816.795 289 814.448 289H803.984V266.536H814.096C816.379 266.536 818.16 267.059 819.44 268.104C820.741 269.149 821.392 270.568 821.392 272.36C821.392 273.683 821.04 274.781 820.336 275.656C819.653 276.531 818.736 277.139 817.584 277.48ZM809.456 275.624H813.04C813.936 275.624 814.619 275.432 815.088 275.048C815.579 274.643 815.824 274.056 815.824 273.288C815.824 272.52 815.579 271.933 815.088 271.528C814.619 271.123 813.936 270.92 813.04 270.92H809.456V275.624ZM813.488 284.584C814.405 284.584 815.109 284.381 815.6 283.976C816.112 283.549 816.368 282.941 816.368 282.152C816.368 281.363 816.101 280.744 815.568 280.296C815.056 279.848 814.341 279.624 813.424 279.624H809.456V284.584H813.488Z" fill="#FBFFFE"/>
          <path id="C" d="M75.056 275.736C75.056 273.517 75.536 271.544 76.496 269.816C77.456 268.067 78.7893 266.712 80.496 265.752C82.224 264.771 84.176 264.28 86.352 264.28C89.0187 264.28 91.3013 264.984 93.2 266.392C95.0987 267.8 96.368 269.72 97.008 272.152H90.992C90.544 271.213 89.904 270.499 89.072 270.008C88.2613 269.517 87.3333 269.272 86.288 269.272C84.6027 269.272 83.2373 269.859 82.192 271.032C81.1467 272.205 80.624 273.773 80.624 275.736C80.624 277.699 81.1467 279.267 82.192 280.44C83.2373 281.613 84.6027 282.2 86.288 282.2C87.3333 282.2 88.2613 281.955 89.072 281.464C89.904 280.973 90.544 280.259 90.992 279.32H97.008C96.368 281.752 95.0987 283.672 93.2 285.08C91.3013 286.467 89.0187 287.16 86.352 287.16C84.176 287.16 82.224 286.68 80.496 285.72C78.7893 284.739 77.456 283.384 76.496 281.656C75.536 279.928 75.056 277.955 75.056 275.736Z" fill="#FBFFFE"/>
          <path id="A" d="M442.968 83.032H434.584L433.24 87H427.512L435.64 64.536H441.976L450.104 87H444.312L442.968 83.032ZM441.56 78.808L438.776 70.584L436.024 78.808H441.56Z" fill="#FBFFFE"/>
          <path id="AB8" d="M668.28 128.456C666.275 127.389 665.272 125.715 665.272 123.432C665.272 122.28 665.571 121.235 666.168 120.296C666.765 119.336 667.672 118.579 668.888 118.024C670.104 117.448 671.597 117.16 673.368 117.16C675.139 117.16 676.621 117.448 677.816 118.024C679.032 118.579 679.939 119.336 680.536 120.296C681.133 121.235 681.432 122.28 681.432 123.432C681.432 124.584 681.155 125.587 680.6 126.44C680.067 127.293 679.341 127.965 678.424 128.456C679.576 129.011 680.461 129.779 681.08 130.76C681.699 131.72 682.008 132.851 682.008 134.152C682.008 135.667 681.624 136.979 680.856 138.088C680.088 139.176 679.043 140.008 677.72 140.584C676.419 141.16 674.968 141.448 673.368 141.448C671.768 141.448 670.307 141.16 668.984 140.584C667.683 140.008 666.648 139.176 665.88 138.088C665.112 136.979 664.728 135.667 664.728 134.152C664.728 132.829 665.037 131.688 665.656 130.728C666.275 129.747 667.149 128.989 668.28 128.456ZM676.12 124.264C676.12 123.389 675.864 122.717 675.352 122.248C674.861 121.757 674.2 121.512 673.368 121.512C672.536 121.512 671.864 121.757 671.352 122.248C670.861 122.739 670.616 123.421 670.616 124.296C670.616 125.128 670.872 125.789 671.384 126.28C671.896 126.749 672.557 126.984 673.368 126.984C674.179 126.984 674.84 126.739 675.352 126.248C675.864 125.757 676.12 125.096 676.12 124.264ZM673.368 130.824C672.365 130.824 671.555 131.101 670.936 131.656C670.317 132.189 670.008 132.936 670.008 133.896C670.008 134.792 670.307 135.528 670.904 136.104C671.523 136.68 672.344 136.968 673.368 136.968C674.392 136.968 675.192 136.68 675.768 136.104C676.365 135.528 676.664 134.792 676.664 133.896C676.664 132.957 676.355 132.211 675.736 131.656C675.139 131.101 674.349 130.824 673.368 130.824Z" fill="#00527F"/>
          <path id="AC1" d="M234.864 116.728V111.64H243.728V135H238.032V116.728H234.864Z" fill="#00527F"/>
          <path id="BC2" d="M453.248 228.616C453.973 228.04 454.304 227.773 454.24 227.816C456.331 226.088 457.973 224.669 459.168 223.56C460.384 222.451 461.408 221.288 462.24 220.072C463.072 218.856 463.488 217.672 463.488 216.52C463.488 215.645 463.285 214.963 462.88 214.472C462.475 213.981 461.867 213.736 461.056 213.736C460.245 213.736 459.605 214.045 459.136 214.664C458.688 215.261 458.464 216.115 458.464 217.224H453.184C453.227 215.411 453.611 213.896 454.336 212.68C455.083 211.464 456.053 210.568 457.248 209.992C458.464 209.416 459.808 209.128 461.28 209.128C463.819 209.128 465.728 209.779 467.008 211.08C468.309 212.381 468.96 214.077 468.96 216.168C468.96 218.451 468.181 220.573 466.624 222.536C465.067 224.477 463.083 226.376 460.672 228.232H469.312V232.68H453.248V228.616Z" fill="#00527F"/>
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
          </svg>`;
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
        vHTML = `<svg  class="network" width="1400" height="893" viewBox="0 0 1432 893" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Group 14">
          <line class="AC" id="AC" x1="88.7361" y1="243.327" x2="654.736" y2="76.327" stroke="#00527F" stroke-width="16"/>
          <line class="BC" id="BC" x1="100.09" y1="251.001" x2="1350.09" y2="265" stroke="#00527F" stroke-width="16"/>
          <line class="AD" id="AD" x1="451.97" y1="544.181" x2="696.97" y2="93.1812" stroke="#00527F" stroke-width="16"/>
          <line class="DE" id="DE" x1="454" y1="578" x2="1064" y2="578" stroke="#00527F" stroke-width="16"/>
          <line class="AE" id="AE" x1="723.876" y1="92.9111" x2="1012.88" y2="578.911" stroke="#00527F" stroke-width="16"/>
          <line class="CD" id="CD" x1="383.133" y1="557.438" x2="104.133" y2="256.438" stroke="#00527F" stroke-width="16"/>
          <line class="EF" id="EF" x1="1075.47" y1="557.842" x2="780.466" y2="833.842" stroke="#00527F" stroke-width="16"/>
          <line class="DF" id="DF" x1="374.8" y1="539.489" x2="660.799" y2="840.49" stroke="#00527F" stroke-width="16"/>
          <line class="AB" id="AB" x1="777.467" y1="80.3899" x2="1360.47" y2="269.39" stroke="#00527F" stroke-width="16"/>
          <line class="BE" id="BE" x1="1061.18" y1="559.507" x2="1333.18" y2="271.507" stroke="#00527F" stroke-width="16"/>
          <g id="Router-B">
          <g id="RB">
          <g id="g3813">
          <path id="path3759" d="M1255.23 235.645V282.941H1255.25C1255.31 290.98 1268.65 298.799 1292.47 303.108C1328.07 309.548 1373.59 305.714 1394.14 294.56C1400.91 290.89 1404.12 286.894 1404.13 282.941V235.762C1404.1 239.706 1400.89 243.691 1394.14 247.352C1373.59 258.506 1328.07 262.325 1292.47 255.885C1268.56 251.561 1255.22 243.714 1255.25 235.645H1255.23Z" fill="url(#paint0_linear_11_117)"/>
          <path id="path4755" d="M1394.15 247.523C1389.26 250.176 1382.75 252.501 1375 254.366C1367.25 256.231 1358.39 257.6 1348.95 258.393C1339.51 259.186 1329.66 259.388 1319.97 258.989C1310.27 258.589 1300.93 257.595 1292.46 256.063C1284 254.532 1276.57 252.493 1270.62 250.063C1264.67 247.633 1260.31 244.859 1257.78 241.9C1255.25 238.941 1254.61 235.855 1255.88 232.819C1257.16 229.782 1260.33 226.854 1265.22 224.201C1270.11 221.548 1276.62 219.223 1284.37 217.358C1292.13 215.493 1300.98 214.125 1310.42 213.332C1319.86 212.539 1329.71 212.336 1339.41 212.736C1349.1 213.135 1358.44 214.129 1366.91 215.661C1375.38 217.192 1382.8 219.231 1388.75 221.662C1394.7 224.092 1399.06 226.865 1401.59 229.824C1404.12 232.783 1404.77 235.869 1403.49 238.906C1402.21 241.942 1399.04 244.871 1394.15 247.523Z" fill="#00527F"/>
          <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M1367.18 234.039L1357.84 239.111L1390.96 245.103L1384.73 248.484L1351.61 242.492L1342.26 247.563L1336.05 237.424L1367.18 234.039Z" fill="white"/>
          <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M1317.11 224.161L1307.76 229.232L1274.64 223.24L1268.41 226.621L1301.53 232.613L1292.19 237.685L1323.32 234.301L1317.11 224.161Z" fill="white"/>
          <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M1326.24 250.034L1313.3 247.691L1332.42 237.313L1323.79 235.751L1304.66 246.13L1291.71 243.787L1298.2 252.761L1326.24 250.034Z" fill="white"/>
          <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M1367.66 227.937L1354.71 225.595L1335.58 235.973L1326.95 234.412L1346.08 224.033L1333.13 221.691L1361.17 218.964L1367.66 227.937Z" fill="white"/>
          </g>
          <path id="path3798" d="M1328.08 212.546C1302.95 212.722 1278.72 216.888 1265.23 224.209C1258.57 227.823 1255.35 231.756 1255.25 235.651H1255.23V282.947H1255.25C1255.31 290.986 1268.65 298.805 1292.47 303.114C1328.07 309.554 1373.59 305.72 1394.14 294.565C1400.91 290.896 1404.12 286.9 1404.13 282.947V235.93C1404.17 227.855 1390.83 219.987 1366.91 215.66C1354.67 213.446 1341.25 212.454 1328.08 212.546Z" stroke="white"/>
          </g>
          <path id="B" d="M1338.58 282.48C1339.89 282.757 1340.93 283.408 1341.72 284.432C1342.51 285.435 1342.9 286.587 1342.9 287.888C1342.9 289.765 1342.24 291.259 1340.92 292.368C1339.62 293.456 1337.79 294 1335.45 294H1324.98V271.536H1335.1C1337.38 271.536 1339.16 272.059 1340.44 273.104C1341.74 274.149 1342.39 275.568 1342.39 277.36C1342.39 278.683 1342.04 279.781 1341.34 280.656C1340.65 281.531 1339.74 282.139 1338.58 282.48ZM1330.46 280.624H1334.04C1334.94 280.624 1335.62 280.432 1336.09 280.048C1336.58 279.643 1336.82 279.056 1336.82 278.288C1336.82 277.52 1336.58 276.933 1336.09 276.528C1335.62 276.123 1334.94 275.92 1334.04 275.92H1330.46V280.624ZM1334.49 289.584C1335.41 289.584 1336.11 289.381 1336.6 288.976C1337.11 288.549 1337.37 287.941 1337.37 287.152C1337.37 286.363 1337.1 285.744 1336.57 285.296C1336.06 284.848 1335.34 284.624 1334.42 284.624H1330.46V289.584H1334.49Z" fill="#FBFFFE"/>
          </g>
          <g id="Router-C">
          <g id="RC">
          <g id="g3813_2">
          <path id="path3759_2" d="M27.2303 218.645V265.941H27.2459C27.3122 273.98 40.6461 281.799 64.4658 286.108C100.067 292.548 145.59 288.714 166.144 277.56C172.905 273.89 176.119 269.894 176.125 265.941V218.762C176.103 222.706 172.889 226.691 166.144 230.352C145.59 241.506 100.067 245.325 64.4658 238.885C40.5609 234.561 27.2171 226.714 27.2459 218.645H27.2303Z" fill="url(#paint1_linear_11_117)"/>
          <path id="path4755_2" d="M166.148 230.523C161.261 233.176 154.755 235.501 147 237.366C139.245 239.231 130.394 240.6 120.951 241.393C111.508 242.186 101.659 242.388 91.9668 241.989C82.2742 241.589 72.9279 240.595 64.4616 239.063C55.9952 237.532 48.5747 235.493 42.6238 233.063C36.6729 230.633 32.3082 227.859 29.7789 224.9C27.2497 221.941 26.6054 218.855 27.883 215.819C29.1605 212.782 32.3349 209.854 37.2247 207.201C42.111 204.548 48.6174 202.223 56.3723 200.358C64.1273 198.493 72.9789 197.125 82.4216 196.332C91.8643 195.539 101.713 195.336 111.406 195.736C121.098 196.135 130.445 197.129 138.911 198.661C147.377 200.192 154.798 202.231 160.749 204.662C166.7 207.092 171.064 209.865 173.593 212.824C176.123 215.783 176.767 218.869 175.489 221.906C174.212 224.942 171.038 227.871 166.148 230.523Z" fill="#00527F"/>
          <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M139.183 217.039L129.837 222.111L162.962 228.103L156.732 231.484L123.607 225.492L114.262 230.563L108.051 220.424L139.183 217.039Z" fill="white"/>
          <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M89.1097 207.161L79.7645 212.232L46.6398 206.24L40.4097 209.621L73.5343 215.613L64.1891 220.685L95.3212 217.301L89.1097 207.161Z" fill="white"/>
          <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M98.2447 233.034L85.2956 230.691L104.42 220.313L95.7874 218.751L76.6629 229.13L63.7137 226.787L70.1991 235.761L98.2447 233.034Z" fill="white"/>
          <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M139.658 210.937L126.708 208.595L107.584 218.973L98.9517 217.412L118.076 207.033L105.127 204.691L133.173 201.964L139.658 210.937Z" fill="white"/>
          </g>
          <path id="path3798_2" d="M100.085 195.546C74.9507 195.722 50.7164 199.888 37.2277 207.209C30.5677 210.823 27.3473 214.756 27.2464 218.651H27.2308V265.947H27.2464C27.3127 273.986 40.6465 281.805 64.4663 286.114C100.067 292.554 145.59 288.72 166.145 277.565C172.906 273.896 176.12 269.9 176.126 265.947V218.93C176.171 210.855 162.826 202.987 138.906 198.66C126.668 196.446 113.25 195.454 100.085 195.546Z" stroke="white"/>
          </g>
          <path id="C" d="M87.056 264.736C87.056 262.517 87.536 260.544 88.496 258.816C89.456 257.067 90.7893 255.712 92.496 254.752C94.224 253.771 96.176 253.28 98.352 253.28C101.019 253.28 103.301 253.984 105.2 255.392C107.099 256.8 108.368 258.72 109.008 261.152H102.992C102.544 260.213 101.904 259.499 101.072 259.008C100.261 258.517 99.3333 258.272 98.288 258.272C96.6027 258.272 95.2373 258.859 94.192 260.032C93.1467 261.205 92.624 262.773 92.624 264.736C92.624 266.699 93.1467 268.267 94.192 269.44C95.2373 270.613 96.6027 271.2 98.288 271.2C99.3333 271.2 100.261 270.955 101.072 270.464C101.904 269.973 102.544 269.259 102.992 268.32H109.008C108.368 270.752 107.099 272.672 105.2 274.08C103.301 275.467 101.019 276.16 98.352 276.16C96.176 276.16 94.224 275.68 92.496 274.72C90.7893 273.739 89.456 272.384 88.496 270.656C87.536 268.928 87.056 266.955 87.056 264.736Z" fill="#FBFFFE"/>
          </g>
          <g id="Router-E">
          <g id="RE">
          <g id="g3813_3">
          <path id="path3759_3" d="M948.23 553.645V600.941H948.246C948.312 608.98 961.646 616.799 985.466 621.108C1021.07 627.548 1066.59 623.714 1087.14 612.56C1093.91 608.89 1097.12 604.894 1097.13 600.941V553.762C1097.1 557.706 1093.89 561.691 1087.14 565.352C1066.59 576.506 1021.07 580.325 985.466 573.885C961.561 569.561 948.217 561.714 948.246 553.645H948.23Z" fill="url(#paint2_linear_11_117)"/>
          <path id="path4755_3" d="M1087.15 565.523C1082.26 568.176 1075.75 570.501 1068 572.366C1060.25 574.231 1051.39 575.6 1041.95 576.393C1032.51 577.186 1022.66 577.388 1012.97 576.989C1003.27 576.589 993.928 575.595 985.461 574.063C976.995 572.532 969.575 570.493 963.624 568.063C957.673 565.633 953.308 562.859 950.779 559.9C948.25 556.941 947.605 553.855 948.883 550.819C950.16 547.782 953.335 544.854 958.225 542.201C963.111 539.548 969.617 537.223 977.372 535.358C985.127 533.493 993.979 532.125 1003.42 531.332C1012.86 530.539 1022.71 530.336 1032.41 530.736C1042.1 531.135 1051.44 532.129 1059.91 533.661C1068.38 535.192 1075.8 537.231 1081.75 539.662C1087.7 542.092 1092.06 544.865 1094.59 547.824C1097.12 550.783 1097.77 553.869 1096.49 556.906C1095.21 559.942 1092.04 562.871 1087.15 565.523Z" fill="#00527F"/>
          <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M1060.18 552.039L1050.84 557.111L1083.96 563.103L1077.73 566.484L1044.61 560.492L1035.26 565.563L1029.05 555.424L1060.18 552.039Z" fill="white"/>
          <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M1010.11 542.161L1000.76 547.232L967.64 541.24L961.41 544.621L994.534 550.613L985.189 555.685L1016.32 552.301L1010.11 542.161Z" fill="white"/>
          <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M1019.24 568.034L1006.3 565.691L1025.42 555.313L1016.79 553.751L997.663 564.13L984.714 561.787L991.199 570.761L1019.24 568.034Z" fill="white"/>
          <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M1060.66 545.937L1047.71 543.595L1028.58 553.973L1019.95 552.412L1039.08 542.033L1026.13 539.691L1054.17 536.964L1060.66 545.937Z" fill="white"/>
          </g>
          <path id="path3798_3" d="M1021.08 530.546C995.951 530.722 971.716 534.888 958.228 542.209C951.568 545.823 948.347 549.756 948.246 553.651H948.231V600.947H948.246C948.313 608.986 961.647 616.805 985.466 621.114C1021.07 627.554 1066.59 623.72 1087.14 612.565C1093.91 608.896 1097.12 604.9 1097.13 600.947V553.93C1097.17 545.855 1083.83 537.987 1059.91 533.66C1047.67 531.446 1034.25 530.454 1021.08 530.546Z" stroke="white"/>
          </g>
          <path id="E" d="M1022.63 594.195V598.739H1029.96V602.963H1022.63V607.891H1030.92V612.275H1017.16V589.811H1030.92V594.195H1022.63Z" fill="#FBFFFE"/>
          </g>
          <g id="Router-D">
          <g id="g3813_4">
          <path id="path3759_4" d="M346.23 549.645V596.941H346.246C346.312 604.98 359.646 612.799 383.466 617.108C419.067 623.548 464.59 619.714 485.144 608.56C491.905 604.89 495.119 600.894 495.125 596.941V549.762C495.103 553.706 491.889 557.691 485.144 561.352C464.59 572.506 419.067 576.325 383.466 569.885C359.561 565.561 346.217 557.714 346.246 549.645H346.23Z" fill="url(#paint3_linear_11_117)"/>
          <path id="path4755_4" d="M485.148 561.523C480.261 564.176 473.755 566.501 466 568.366C458.245 570.231 449.393 571.6 439.951 572.393C430.508 573.186 420.659 573.388 410.967 572.989C401.274 572.589 391.928 571.595 383.461 570.063C374.995 568.532 367.575 566.493 361.624 564.063C355.673 561.633 351.308 558.859 348.779 555.9C346.25 552.941 345.605 549.855 346.883 546.819C348.16 543.782 351.335 540.854 356.225 538.201C361.111 535.548 367.617 533.223 375.372 531.358C383.127 529.493 391.979 528.125 401.421 527.332C410.864 526.539 420.713 526.336 430.406 526.736C440.098 527.135 449.444 528.129 457.911 529.661C466.377 531.192 473.798 533.231 479.749 535.662C485.699 538.092 490.064 540.865 492.593 543.824C495.123 546.783 495.767 549.869 494.489 552.906C493.212 555.942 490.037 558.871 485.148 561.523Z" fill="#00527F"/>
          <path id="path2775_4" fill-rule="evenodd" clip-rule="evenodd" d="M458.183 548.039L448.837 553.111L481.962 559.103L475.732 562.484L442.607 556.492L433.262 561.563L427.05 551.424L458.183 548.039Z" fill="white"/>
          <path id="path4757_4" fill-rule="evenodd" clip-rule="evenodd" d="M408.11 538.161L398.764 543.232L365.64 537.24L359.41 540.621L392.534 546.613L383.189 551.685L414.321 548.301L408.11 538.161Z" fill="white"/>
          <path id="path4759_4" fill-rule="evenodd" clip-rule="evenodd" d="M417.245 564.034L404.296 561.691L423.42 551.313L414.787 549.751L395.663 560.13L382.714 557.787L389.199 566.761L417.245 564.034Z" fill="white"/>
          <path id="path4761_4" fill-rule="evenodd" clip-rule="evenodd" d="M458.658 541.937L445.708 539.595L426.584 549.973L417.952 548.412L437.076 538.033L424.127 535.691L452.173 532.964L458.658 541.937Z" fill="white"/>
          </g>
          <path id="path3798_4" d="M419.085 526.546C393.951 526.722 369.716 530.888 356.228 538.208C349.568 541.823 346.347 545.755 346.246 549.651H346.231V596.947H346.246C346.313 604.986 359.647 612.805 383.466 617.114C419.067 623.554 464.59 619.72 485.145 608.565C491.906 604.896 495.12 600.9 495.126 596.947V549.93C495.171 541.855 481.826 533.987 457.906 529.66C445.668 527.446 432.25 526.454 419.085 526.546Z" stroke="white"/>
          <path id="D" d="M417.4 585.536C419.768 585.536 421.837 586.005 423.608 586.944C425.379 587.883 426.744 589.205 427.704 590.912C428.685 592.597 429.176 594.549 429.176 596.768C429.176 598.965 428.685 600.917 427.704 602.624C426.744 604.331 425.368 605.653 423.576 606.592C421.805 607.531 419.747 608 417.4 608H408.984V585.536H417.4ZM417.048 603.264C419.117 603.264 420.728 602.699 421.88 601.568C423.032 600.437 423.608 598.837 423.608 596.768C423.608 594.699 423.032 593.088 421.88 591.936C420.728 590.784 419.117 590.208 417.048 590.208H414.456V603.264H417.048Z" fill="#FBFFFE"/>
          </g>
          <g id="Router-A">
          <g id="RA">
          <g id="g3813_5">
          <path id="path3759_5" d="M636.23 31.645V78.9412H636.246C636.312 86.98 649.646 94.7993 673.466 99.1081C709.067 105.548 754.59 101.714 775.144 90.5596C781.906 86.8903 785.119 82.8941 785.126 78.9412V31.7625C785.103 35.7058 781.889 39.6914 775.144 43.3515C754.59 54.5061 709.067 58.3255 673.466 51.8854C649.561 47.5611 636.217 39.7141 636.246 31.645H636.23Z" fill="url(#paint4_linear_11_117)"/>
          <path id="path4755_5" d="M775.148 43.5229C770.261 46.1759 763.755 48.5013 756 50.3664C748.245 52.2314 739.394 53.5996 729.951 54.3927C720.508 55.1857 710.659 55.3882 700.967 54.9886C691.274 54.589 681.928 53.595 673.462 52.0635C664.995 50.532 657.575 48.4929 651.624 46.0627C645.673 43.6325 641.308 40.8589 638.779 37.9001C636.25 34.9413 635.605 31.8555 636.883 28.8187C638.161 25.7819 641.335 22.8537 646.225 20.2013C651.111 17.5483 657.617 15.2229 665.372 13.3579C673.127 11.4928 681.979 10.1247 691.422 9.3316C700.864 8.53851 710.713 8.336 720.406 8.73565C730.098 9.13529 739.445 10.1293 747.911 11.6608C756.377 13.1923 763.798 15.2314 769.749 17.6616C775.7 20.0917 780.064 22.8654 782.593 25.8242C785.123 28.7829 785.767 31.8688 784.489 34.9056C783.212 37.9424 780.038 40.8705 775.148 43.5229Z" fill="#00527F"/>
          <path id="path2775_5" fill-rule="evenodd" clip-rule="evenodd" d="M748.183 30.0394L738.837 35.1109L771.962 41.103L765.732 44.484L732.607 38.4919L723.262 43.5634L717.051 33.4237L748.183 30.0394Z" fill="white"/>
          <path id="path4757_5" fill-rule="evenodd" clip-rule="evenodd" d="M698.11 20.1608L688.764 25.2324L655.64 19.2403L649.41 22.6213L682.534 28.6134L673.189 33.6849L704.321 30.3005L698.11 20.1608Z" fill="white"/>
          <path id="path4759_5" fill-rule="evenodd" clip-rule="evenodd" d="M707.245 46.0337L694.296 43.6913L713.42 33.3126L704.787 31.751L685.663 42.1297L672.714 39.7872L679.199 48.7607L707.245 46.0337Z" fill="white"/>
          <path id="path4761_5" fill-rule="evenodd" clip-rule="evenodd" d="M748.658 23.9373L735.708 21.5949L716.584 31.9733L707.952 30.4116L727.076 20.0333L714.127 17.6908L742.173 14.9636L748.658 23.9373Z" fill="white"/>
          </g>
          <path id="path3798_5" d="M709.085 8.54602C683.951 8.72247 659.716 12.8883 646.228 20.2085C639.568 23.8228 636.347 27.7555 636.246 31.6507H636.231V78.9468H636.246C636.313 86.9857 649.647 94.805 673.466 99.1138C709.067 105.554 754.59 101.72 775.145 90.5652C781.906 86.896 785.12 82.8997 785.126 78.9468V31.9297C785.171 23.8554 771.826 15.9869 747.906 11.6599C735.668 9.44616 722.25 8.4536 709.085 8.54602Z" stroke="white"/>
          </g>
          <path id="A" d="M712.968 83.032H704.584L703.24 87H697.512L705.64 64.536H711.976L720.104 87H714.312L712.968 83.032ZM711.56 78.808L708.776 70.584L706.024 78.808H711.56Z" fill="#FBFFFE"/>
          </g>
          <g id="Router-F">
          <g id="RF">
          <g id="g3813_6">
          <path id="path3759_6" d="M642.23 810.645V857.941H642.246C642.312 865.98 655.646 873.799 679.466 878.108C715.067 884.548 760.59 880.714 781.144 869.56C787.906 865.89 791.119 861.894 791.126 857.941V810.762C791.103 814.706 787.889 818.691 781.144 822.352C760.59 833.506 715.067 837.325 679.466 830.885C655.561 826.561 642.217 818.714 642.246 810.645H642.23Z" fill="url(#paint5_linear_11_117)"/>
          <path id="path4755_6" d="M781.148 822.523C776.261 825.176 769.755 827.501 762 829.366C754.245 831.231 745.394 832.6 735.951 833.393C726.508 834.186 716.659 834.388 706.967 833.989C697.274 833.589 687.928 832.595 679.462 831.063C670.995 829.532 663.575 827.493 657.624 825.063C651.673 822.633 647.308 819.859 644.779 816.9C642.25 813.941 641.605 810.855 642.883 807.819C644.161 804.782 647.335 801.854 652.225 799.201C657.111 796.548 663.617 794.223 671.372 792.358C679.127 790.493 687.979 789.125 697.422 788.332C706.864 787.539 716.713 787.336 726.406 787.736C736.098 788.135 745.445 789.129 753.911 790.661C762.377 792.192 769.798 794.231 775.749 796.662C781.7 799.092 786.064 801.865 788.593 804.824C791.123 807.783 791.767 810.869 790.489 813.906C789.212 816.942 786.038 819.871 781.148 822.523Z" fill="#00527F"/>
          <path id="path2775_6" fill-rule="evenodd" clip-rule="evenodd" d="M754.183 809.039L744.837 814.111L777.962 820.103L771.732 823.484L738.607 817.492L729.262 822.563L723.051 812.424L754.183 809.039Z" fill="white"/>
          <path id="path4757_6" fill-rule="evenodd" clip-rule="evenodd" d="M704.11 799.161L694.764 804.232L661.64 798.24L655.41 801.621L688.534 807.613L679.189 812.685L710.321 809.301L704.11 799.161Z" fill="white"/>
          <path id="path4759_6" fill-rule="evenodd" clip-rule="evenodd" d="M713.245 825.034L700.296 822.691L719.42 812.313L710.787 810.751L691.663 821.13L678.714 818.787L685.199 827.761L713.245 825.034Z" fill="white"/>
          <path id="path4761_6" fill-rule="evenodd" clip-rule="evenodd" d="M754.658 802.937L741.708 800.595L722.584 810.973L713.952 809.412L733.076 799.033L720.127 796.691L748.173 793.964L754.658 802.937Z" fill="white"/>
          </g>
          </g>
          <path id="F" d="M721.608 846.536V850.92H712.456V855.656H719.304V859.912H712.456V869H706.984V846.536H721.608Z" fill="#FBFFFE"/>
          </g>
          <path id="AB3" d="M1041.63 115.232C1041.72 112.949 1042.46 111.189 1043.87 109.952C1045.28 108.715 1047.19 108.096 1049.6 108.096C1051.2 108.096 1052.57 108.373 1053.7 108.928C1054.85 109.483 1055.71 110.24 1056.29 111.2C1056.89 112.16 1057.18 113.237 1057.18 114.432C1057.18 115.84 1056.83 116.992 1056.13 117.888C1055.42 118.763 1054.6 119.36 1053.66 119.68V119.808C1054.88 120.213 1055.84 120.885 1056.54 121.824C1057.25 122.763 1057.6 123.968 1057.6 125.44C1057.6 126.763 1057.29 127.936 1056.67 128.96C1056.07 129.963 1055.19 130.752 1054.02 131.328C1052.86 131.904 1051.49 132.192 1049.89 132.192C1047.33 132.192 1045.28 131.563 1043.74 130.304C1042.23 129.045 1041.43 127.147 1041.34 124.608H1046.66C1046.68 125.547 1046.94 126.293 1047.46 126.848C1047.97 127.381 1048.71 127.648 1049.7 127.648C1050.53 127.648 1051.17 127.413 1051.62 126.944C1052.09 126.453 1052.32 125.813 1052.32 125.024C1052.32 124 1051.99 123.264 1051.33 122.816C1050.69 122.347 1049.65 122.112 1048.22 122.112H1047.2V117.664H1048.22C1049.31 117.664 1050.19 117.483 1050.85 117.12C1051.53 116.736 1051.87 116.064 1051.87 115.104C1051.87 114.336 1051.66 113.739 1051.23 113.312C1050.81 112.885 1050.22 112.672 1049.47 112.672C1048.66 112.672 1048.05 112.917 1047.65 113.408C1047.26 113.899 1047.04 114.507 1046.98 115.232H1041.63Z" fill="#00527F"/>
          <path id="AC4" d="M336.568 127.84V123.424L346.68 108.96H352.792V123.104H355.416V127.84H352.792V132H347.32V127.84H336.568ZM347.704 114.976L342.328 123.104H347.704V114.976Z" fill="#00527F"/>
          <path id="CD1" d="M220.864 419.728V414.64H229.728V438H224.032V419.728H220.864Z" fill="#00527F"/>
          <path id="BE6" d="M1223.99 420.944C1223.82 420.155 1223.52 419.568 1223.1 419.184C1222.67 418.779 1222.06 418.576 1221.27 418.576C1220.06 418.576 1219.18 419.109 1218.65 420.176C1218.11 421.221 1217.84 422.885 1217.82 425.168C1218.29 424.421 1218.96 423.835 1219.83 423.408C1220.73 422.981 1221.71 422.768 1222.78 422.768C1224.87 422.768 1226.54 423.429 1227.8 424.752C1229.08 426.075 1229.72 427.92 1229.72 430.288C1229.72 431.845 1229.4 433.211 1228.76 434.384C1228.14 435.557 1227.22 436.475 1226.01 437.136C1224.81 437.797 1223.39 438.128 1221.75 438.128C1218.47 438.128 1216.18 437.104 1214.9 435.056C1213.62 432.987 1212.98 430.021 1212.98 426.16C1212.98 422.107 1213.66 419.099 1215 417.136C1216.37 415.152 1218.54 414.16 1221.53 414.16C1223.13 414.16 1224.47 414.48 1225.56 415.12C1226.67 415.739 1227.5 416.56 1228.06 417.584C1228.63 418.608 1228.97 419.728 1229.08 420.944H1223.99ZM1221.46 427.088C1220.55 427.088 1219.78 427.365 1219.16 427.92C1218.56 428.453 1218.26 429.221 1218.26 430.224C1218.26 431.248 1218.54 432.048 1219.1 432.624C1219.67 433.2 1220.48 433.488 1221.53 433.488C1222.47 433.488 1223.2 433.211 1223.74 432.656C1224.29 432.08 1224.57 431.301 1224.57 430.32C1224.57 429.317 1224.3 428.528 1223.77 427.952C1223.23 427.376 1222.47 427.088 1221.46 427.088Z" fill="#00527F"/>
          <path id="EF5" d="M940.888 731.408H930.904V735.824C931.331 735.355 931.928 734.971 932.696 734.672C933.464 734.373 934.296 734.224 935.192 734.224C936.792 734.224 938.115 734.587 939.16 735.312C940.227 736.037 941.005 736.976 941.496 738.128C941.987 739.28 942.232 740.528 942.232 741.872C942.232 744.368 941.528 746.352 940.12 747.824C938.712 749.275 936.728 750 934.168 750C932.461 750 930.979 749.712 929.72 749.136C928.461 748.539 927.491 747.717 926.808 746.672C926.125 745.627 925.752 744.421 925.688 743.056H931.032C931.16 743.717 931.469 744.272 931.96 744.72C932.451 745.147 933.123 745.36 933.976 745.36C934.979 745.36 935.725 745.04 936.216 744.4C936.707 743.76 936.952 742.907 936.952 741.84C936.952 740.795 936.696 739.995 936.184 739.44C935.672 738.885 934.925 738.608 933.944 738.608C933.219 738.608 932.621 738.789 932.152 739.152C931.683 739.493 931.373 739.952 931.224 740.528H925.944V726.608H940.888V731.408Z" fill="#00527F"/>
          <path id="CB2" d="M702.248 238.616C702.973 238.04 703.304 237.773 703.24 237.816C705.331 236.088 706.973 234.669 708.168 233.56C709.384 232.451 710.408 231.288 711.24 230.072C712.072 228.856 712.488 227.672 712.488 226.52C712.488 225.645 712.285 224.963 711.88 224.472C711.475 223.981 710.867 223.736 710.056 223.736C709.245 223.736 708.605 224.045 708.136 224.664C707.688 225.261 707.464 226.115 707.464 227.224H702.184C702.227 225.411 702.611 223.896 703.336 222.68C704.083 221.464 705.053 220.568 706.248 219.992C707.464 219.416 708.808 219.128 710.28 219.128C712.819 219.128 714.728 219.779 716.008 221.08C717.309 222.381 717.96 224.077 717.96 226.168C717.96 228.451 717.181 230.573 715.624 232.536C714.067 234.477 712.083 236.376 709.672 238.232H718.312V242.68H702.248V238.616Z" fill="#00527F"/>
          <path id="AE4" d="M916.568 352.84V348.424L926.68 333.96H932.792V348.104H935.416V352.84H932.792V357H927.32V352.84H916.568ZM927.704 339.976L922.328 348.104H927.704V339.976Z" fill="#00527F"/>
          <path id="AD9" d="M509.328 343.152C509.648 344.837 510.629 345.68 512.272 345.68C513.403 345.68 514.203 345.179 514.672 344.176C515.141 343.173 515.376 341.541 515.376 339.28C514.907 339.941 514.267 340.453 513.456 340.816C512.645 341.179 511.739 341.36 510.736 341.36C509.371 341.36 508.155 341.083 507.088 340.528C506.021 339.952 505.179 339.109 504.56 338C503.963 336.869 503.664 335.504 503.664 333.904C503.664 332.325 503.984 330.949 504.624 329.776C505.285 328.603 506.213 327.696 507.408 327.056C508.624 326.416 510.053 326.096 511.696 326.096C514.853 326.096 517.061 327.077 518.32 329.04C519.579 331.003 520.208 333.893 520.208 337.712C520.208 340.485 519.952 342.779 519.44 344.592C518.949 346.384 518.107 347.749 516.912 348.688C515.739 349.627 514.128 350.096 512.08 350.096C510.459 350.096 509.072 349.776 507.92 349.136C506.789 348.496 505.915 347.653 505.296 346.608C504.699 345.563 504.357 344.411 504.272 343.152H509.328ZM511.984 337.04C512.88 337.04 513.595 336.773 514.128 336.24C514.661 335.685 514.928 334.939 514.928 334C514.928 332.976 514.651 332.187 514.096 331.632C513.541 331.077 512.795 330.8 511.856 330.8C510.917 330.8 510.171 331.088 509.616 331.664C509.083 332.219 508.816 332.987 508.816 333.968C508.816 334.885 509.083 335.632 509.616 336.208C510.171 336.763 510.96 337.04 511.984 337.04Z" fill="#00527F"/>
          <path id="DE3" d="M712.632 607.232C712.717 604.949 713.464 603.189 714.872 601.952C716.28 600.715 718.189 600.096 720.6 600.096C722.2 600.096 723.565 600.373 724.696 600.928C725.848 601.483 726.712 602.24 727.288 603.2C727.885 604.16 728.184 605.237 728.184 606.432C728.184 607.84 727.832 608.992 727.128 609.888C726.424 610.763 725.603 611.36 724.664 611.68V611.808C725.88 612.213 726.84 612.885 727.544 613.824C728.248 614.763 728.6 615.968 728.6 617.44C728.6 618.763 728.291 619.936 727.672 620.96C727.075 621.963 726.189 622.752 725.016 623.328C723.864 623.904 722.488 624.192 720.888 624.192C718.328 624.192 716.28 623.563 714.744 622.304C713.229 621.045 712.429 619.147 712.344 616.608H717.656C717.677 617.547 717.944 618.293 718.456 618.848C718.968 619.381 719.715 619.648 720.696 619.648C721.528 619.648 722.168 619.413 722.616 618.944C723.085 618.453 723.32 617.813 723.32 617.024C723.32 616 722.989 615.264 722.328 614.816C721.688 614.347 720.653 614.112 719.224 614.112H718.2V609.664H719.224C720.312 609.664 721.187 609.483 721.848 609.12C722.531 608.736 722.872 608.064 722.872 607.104C722.872 606.336 722.659 605.739 722.232 605.312C721.805 604.885 721.219 604.672 720.472 604.672C719.661 604.672 719.053 604.917 718.648 605.408C718.264 605.899 718.04 606.507 717.976 607.232H712.632Z" fill="#00527F"/>
          <path id="DF7" d="M528.352 725.736L520.32 745H514.72L522.848 726.344H512.896V721.672H528.352V725.736Z" fill="#00527F"/>
          </g>
          <defs>
          <linearGradient id="paint0_linear_11_117" x1="1255.23" y1="270.939" x2="1404.13" y2="270.939" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00527F"/>
          <stop offset="1" stop-color="#8AAAC0"/>
          </linearGradient>
          <linearGradient id="paint1_linear_11_117" x1="27.2303" y1="253.939" x2="176.125" y2="253.939" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00527F"/>
          <stop offset="1" stop-color="#8AAAC0"/>
          </linearGradient>
          <linearGradient id="paint2_linear_11_117" x1="948.23" y1="588.939" x2="1097.13" y2="588.939" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00527F"/>
          <stop offset="1" stop-color="#8AAAC0"/>
          </linearGradient>
          <linearGradient id="paint3_linear_11_117" x1="346.23" y1="584.939" x2="495.125" y2="584.939" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00527F"/>
          <stop offset="1" stop-color="#8AAAC0"/>
          </linearGradient>
          <linearGradient id="paint4_linear_11_117" x1="636.23" y1="66.9392" x2="785.126" y2="66.9392" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00527F"/>
          <stop offset="1" stop-color="#8AAAC0"/>
          </linearGradient>
          <linearGradient id="paint5_linear_11_117" x1="642.23" y1="845.939" x2="791.126" y2="845.939" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00527F"/>
          <stop offset="1" stop-color="#8AAAC0"/>
          </linearGradient>
          </defs>
          </svg> `;
      }else if(router == 6){
      
        vHTML = `<svg  class="network" width="1400" height="893" viewBox="0 0 1432 893" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 14">
        <line class="AC" id="AC" x1="88.7361" y1="243.327" x2="654.736" y2="76.327" stroke="#00527F" stroke-width="16"/>
        <line class="BC" id="BC" x1="100.09" y1="251.001" x2="1350.09" y2="265" stroke="#00527F" stroke-width="16"/>
        <line class="AD" id="AD" x1="451.97" y1="544.181" x2="696.97" y2="93.1812" stroke="#00527F" stroke-width="16"/>
        <line class="DE" id="DE" x1="454" y1="578" x2="1064" y2="578" stroke="#00527F" stroke-width="16"/>
        <line class="AE" id="AE" x1="723.876" y1="92.9111" x2="1012.88" y2="578.911" stroke="#00527F" stroke-width="16"/>
        <line class="CD" id="CD" x1="383.133" y1="557.438" x2="104.133" y2="256.438" stroke="#00527F" stroke-width="16"/>
        <line class="EF" id="EF" x1="1075.47" y1="557.842" x2="780.466" y2="833.842" stroke="#00527F" stroke-width="16"/>
        <line class="DF" id="DF" x1="374.8" y1="539.489" x2="660.799" y2="840.49" stroke="#00527F" stroke-width="16"/>
        <line class="AB" id="AB" x1="777.467" y1="80.3899" x2="1360.47" y2="269.39" stroke="#00527F" stroke-width="16"/>
        <line class="BE" id="BE" x1="1061.18" y1="559.507" x2="1333.18" y2="271.507" stroke="#00527F" stroke-width="16"/>
        <g id="Router-B">
        <g id="RB">
        <g id="g3813">
        <path id="path3759" d="M1255.23 235.645V282.941H1255.25C1255.31 290.98 1268.65 298.799 1292.47 303.108C1328.07 309.548 1373.59 305.714 1394.14 294.56C1400.91 290.89 1404.12 286.894 1404.13 282.941V235.762C1404.1 239.706 1400.89 243.691 1394.14 247.352C1373.59 258.506 1328.07 262.325 1292.47 255.885C1268.56 251.561 1255.22 243.714 1255.25 235.645H1255.23Z" fill="url(#paint0_linear_11_117)"/>
        <path id="path4755" d="M1394.15 247.523C1389.26 250.176 1382.75 252.501 1375 254.366C1367.25 256.231 1358.39 257.6 1348.95 258.393C1339.51 259.186 1329.66 259.388 1319.97 258.989C1310.27 258.589 1300.93 257.595 1292.46 256.063C1284 254.532 1276.57 252.493 1270.62 250.063C1264.67 247.633 1260.31 244.859 1257.78 241.9C1255.25 238.941 1254.61 235.855 1255.88 232.819C1257.16 229.782 1260.33 226.854 1265.22 224.201C1270.11 221.548 1276.62 219.223 1284.37 217.358C1292.13 215.493 1300.98 214.125 1310.42 213.332C1319.86 212.539 1329.71 212.336 1339.41 212.736C1349.1 213.135 1358.44 214.129 1366.91 215.661C1375.38 217.192 1382.8 219.231 1388.75 221.662C1394.7 224.092 1399.06 226.865 1401.59 229.824C1404.12 232.783 1404.77 235.869 1403.49 238.906C1402.21 241.942 1399.04 244.871 1394.15 247.523Z" fill="#00527F"/>
        <path id="path2775" fill-rule="evenodd" clip-rule="evenodd" d="M1367.18 234.039L1357.84 239.111L1390.96 245.103L1384.73 248.484L1351.61 242.492L1342.26 247.563L1336.05 237.424L1367.18 234.039Z" fill="white"/>
        <path id="path4757" fill-rule="evenodd" clip-rule="evenodd" d="M1317.11 224.161L1307.76 229.232L1274.64 223.24L1268.41 226.621L1301.53 232.613L1292.19 237.685L1323.32 234.301L1317.11 224.161Z" fill="white"/>
        <path id="path4759" fill-rule="evenodd" clip-rule="evenodd" d="M1326.24 250.034L1313.3 247.691L1332.42 237.313L1323.79 235.751L1304.66 246.13L1291.71 243.787L1298.2 252.761L1326.24 250.034Z" fill="white"/>
        <path id="path4761" fill-rule="evenodd" clip-rule="evenodd" d="M1367.66 227.937L1354.71 225.595L1335.58 235.973L1326.95 234.412L1346.08 224.033L1333.13 221.691L1361.17 218.964L1367.66 227.937Z" fill="white"/>
        </g>
        <path id="path3798" d="M1328.08 212.546C1302.95 212.722 1278.72 216.888 1265.23 224.209C1258.57 227.823 1255.35 231.756 1255.25 235.651H1255.23V282.947H1255.25C1255.31 290.986 1268.65 298.805 1292.47 303.114C1328.07 309.554 1373.59 305.72 1394.14 294.565C1400.91 290.896 1404.12 286.9 1404.13 282.947V235.93C1404.17 227.855 1390.83 219.987 1366.91 215.66C1354.67 213.446 1341.25 212.454 1328.08 212.546Z" stroke="white"/>
        </g>
        <path id="B" d="M1338.58 282.48C1339.89 282.757 1340.93 283.408 1341.72 284.432C1342.51 285.435 1342.9 286.587 1342.9 287.888C1342.9 289.765 1342.24 291.259 1340.92 292.368C1339.62 293.456 1337.79 294 1335.45 294H1324.98V271.536H1335.1C1337.38 271.536 1339.16 272.059 1340.44 273.104C1341.74 274.149 1342.39 275.568 1342.39 277.36C1342.39 278.683 1342.04 279.781 1341.34 280.656C1340.65 281.531 1339.74 282.139 1338.58 282.48ZM1330.46 280.624H1334.04C1334.94 280.624 1335.62 280.432 1336.09 280.048C1336.58 279.643 1336.82 279.056 1336.82 278.288C1336.82 277.52 1336.58 276.933 1336.09 276.528C1335.62 276.123 1334.94 275.92 1334.04 275.92H1330.46V280.624ZM1334.49 289.584C1335.41 289.584 1336.11 289.381 1336.6 288.976C1337.11 288.549 1337.37 287.941 1337.37 287.152C1337.37 286.363 1337.1 285.744 1336.57 285.296C1336.06 284.848 1335.34 284.624 1334.42 284.624H1330.46V289.584H1334.49Z" fill="#FBFFFE"/>
        </g>
        <g id="Router-C">
        <g id="RC">
        <g id="g3813_2">
        <path id="path3759_2" d="M27.2303 218.645V265.941H27.2459C27.3122 273.98 40.6461 281.799 64.4658 286.108C100.067 292.548 145.59 288.714 166.144 277.56C172.905 273.89 176.119 269.894 176.125 265.941V218.762C176.103 222.706 172.889 226.691 166.144 230.352C145.59 241.506 100.067 245.325 64.4658 238.885C40.5609 234.561 27.2171 226.714 27.2459 218.645H27.2303Z" fill="url(#paint1_linear_11_117)"/>
        <path id="path4755_2" d="M166.148 230.523C161.261 233.176 154.755 235.501 147 237.366C139.245 239.231 130.394 240.6 120.951 241.393C111.508 242.186 101.659 242.388 91.9668 241.989C82.2742 241.589 72.9279 240.595 64.4616 239.063C55.9952 237.532 48.5747 235.493 42.6238 233.063C36.6729 230.633 32.3082 227.859 29.7789 224.9C27.2497 221.941 26.6054 218.855 27.883 215.819C29.1605 212.782 32.3349 209.854 37.2247 207.201C42.111 204.548 48.6174 202.223 56.3723 200.358C64.1273 198.493 72.9789 197.125 82.4216 196.332C91.8643 195.539 101.713 195.336 111.406 195.736C121.098 196.135 130.445 197.129 138.911 198.661C147.377 200.192 154.798 202.231 160.749 204.662C166.7 207.092 171.064 209.865 173.593 212.824C176.123 215.783 176.767 218.869 175.489 221.906C174.212 224.942 171.038 227.871 166.148 230.523Z" fill="#00527F"/>
        <path id="path2775_2" fill-rule="evenodd" clip-rule="evenodd" d="M139.183 217.039L129.837 222.111L162.962 228.103L156.732 231.484L123.607 225.492L114.262 230.563L108.051 220.424L139.183 217.039Z" fill="white"/>
        <path id="path4757_2" fill-rule="evenodd" clip-rule="evenodd" d="M89.1097 207.161L79.7645 212.232L46.6398 206.24L40.4097 209.621L73.5343 215.613L64.1891 220.685L95.3212 217.301L89.1097 207.161Z" fill="white"/>
        <path id="path4759_2" fill-rule="evenodd" clip-rule="evenodd" d="M98.2447 233.034L85.2956 230.691L104.42 220.313L95.7874 218.751L76.6629 229.13L63.7137 226.787L70.1991 235.761L98.2447 233.034Z" fill="white"/>
        <path id="path4761_2" fill-rule="evenodd" clip-rule="evenodd" d="M139.658 210.937L126.708 208.595L107.584 218.973L98.9517 217.412L118.076 207.033L105.127 204.691L133.173 201.964L139.658 210.937Z" fill="white"/>
        </g>
        <path id="path3798_2" d="M100.085 195.546C74.9507 195.722 50.7164 199.888 37.2277 207.209C30.5677 210.823 27.3473 214.756 27.2464 218.651H27.2308V265.947H27.2464C27.3127 273.986 40.6465 281.805 64.4663 286.114C100.067 292.554 145.59 288.72 166.145 277.565C172.906 273.896 176.12 269.9 176.126 265.947V218.93C176.171 210.855 162.826 202.987 138.906 198.66C126.668 196.446 113.25 195.454 100.085 195.546Z" stroke="white"/>
        </g>
        <path id="C" d="M87.056 264.736C87.056 262.517 87.536 260.544 88.496 258.816C89.456 257.067 90.7893 255.712 92.496 254.752C94.224 253.771 96.176 253.28 98.352 253.28C101.019 253.28 103.301 253.984 105.2 255.392C107.099 256.8 108.368 258.72 109.008 261.152H102.992C102.544 260.213 101.904 259.499 101.072 259.008C100.261 258.517 99.3333 258.272 98.288 258.272C96.6027 258.272 95.2373 258.859 94.192 260.032C93.1467 261.205 92.624 262.773 92.624 264.736C92.624 266.699 93.1467 268.267 94.192 269.44C95.2373 270.613 96.6027 271.2 98.288 271.2C99.3333 271.2 100.261 270.955 101.072 270.464C101.904 269.973 102.544 269.259 102.992 268.32H109.008C108.368 270.752 107.099 272.672 105.2 274.08C103.301 275.467 101.019 276.16 98.352 276.16C96.176 276.16 94.224 275.68 92.496 274.72C90.7893 273.739 89.456 272.384 88.496 270.656C87.536 268.928 87.056 266.955 87.056 264.736Z" fill="#FBFFFE"/>
        </g>
        <g id="Router-E">
        <g id="RE">
        <g id="g3813_3">
        <path id="path3759_3" d="M948.23 553.645V600.941H948.246C948.312 608.98 961.646 616.799 985.466 621.108C1021.07 627.548 1066.59 623.714 1087.14 612.56C1093.91 608.89 1097.12 604.894 1097.13 600.941V553.762C1097.1 557.706 1093.89 561.691 1087.14 565.352C1066.59 576.506 1021.07 580.325 985.466 573.885C961.561 569.561 948.217 561.714 948.246 553.645H948.23Z" fill="url(#paint2_linear_11_117)"/>
        <path id="path4755_3" d="M1087.15 565.523C1082.26 568.176 1075.75 570.501 1068 572.366C1060.25 574.231 1051.39 575.6 1041.95 576.393C1032.51 577.186 1022.66 577.388 1012.97 576.989C1003.27 576.589 993.928 575.595 985.461 574.063C976.995 572.532 969.575 570.493 963.624 568.063C957.673 565.633 953.308 562.859 950.779 559.9C948.25 556.941 947.605 553.855 948.883 550.819C950.16 547.782 953.335 544.854 958.225 542.201C963.111 539.548 969.617 537.223 977.372 535.358C985.127 533.493 993.979 532.125 1003.42 531.332C1012.86 530.539 1022.71 530.336 1032.41 530.736C1042.1 531.135 1051.44 532.129 1059.91 533.661C1068.38 535.192 1075.8 537.231 1081.75 539.662C1087.7 542.092 1092.06 544.865 1094.59 547.824C1097.12 550.783 1097.77 553.869 1096.49 556.906C1095.21 559.942 1092.04 562.871 1087.15 565.523Z" fill="#00527F"/>
        <path id="path2775_3" fill-rule="evenodd" clip-rule="evenodd" d="M1060.18 552.039L1050.84 557.111L1083.96 563.103L1077.73 566.484L1044.61 560.492L1035.26 565.563L1029.05 555.424L1060.18 552.039Z" fill="white"/>
        <path id="path4757_3" fill-rule="evenodd" clip-rule="evenodd" d="M1010.11 542.161L1000.76 547.232L967.64 541.24L961.41 544.621L994.534 550.613L985.189 555.685L1016.32 552.301L1010.11 542.161Z" fill="white"/>
        <path id="path4759_3" fill-rule="evenodd" clip-rule="evenodd" d="M1019.24 568.034L1006.3 565.691L1025.42 555.313L1016.79 553.751L997.663 564.13L984.714 561.787L991.199 570.761L1019.24 568.034Z" fill="white"/>
        <path id="path4761_3" fill-rule="evenodd" clip-rule="evenodd" d="M1060.66 545.937L1047.71 543.595L1028.58 553.973L1019.95 552.412L1039.08 542.033L1026.13 539.691L1054.17 536.964L1060.66 545.937Z" fill="white"/>
        </g>
        <path id="path3798_3" d="M1021.08 530.546C995.951 530.722 971.716 534.888 958.228 542.209C951.568 545.823 948.347 549.756 948.246 553.651H948.231V600.947H948.246C948.313 608.986 961.647 616.805 985.466 621.114C1021.07 627.554 1066.59 623.72 1087.14 612.565C1093.91 608.896 1097.12 604.9 1097.13 600.947V553.93C1097.17 545.855 1083.83 537.987 1059.91 533.66C1047.67 531.446 1034.25 530.454 1021.08 530.546Z" stroke="white"/>
        </g>
        <path id="E" d="M1022.63 594.195V598.739H1029.96V602.963H1022.63V607.891H1030.92V612.275H1017.16V589.811H1030.92V594.195H1022.63Z" fill="#FBFFFE"/>
        </g>
        <g id="Router-D">
        <g id="g3813_4">
        <path id="path3759_4" d="M346.23 549.645V596.941H346.246C346.312 604.98 359.646 612.799 383.466 617.108C419.067 623.548 464.59 619.714 485.144 608.56C491.905 604.89 495.119 600.894 495.125 596.941V549.762C495.103 553.706 491.889 557.691 485.144 561.352C464.59 572.506 419.067 576.325 383.466 569.885C359.561 565.561 346.217 557.714 346.246 549.645H346.23Z" fill="url(#paint3_linear_11_117)"/>
        <path id="path4755_4" d="M485.148 561.523C480.261 564.176 473.755 566.501 466 568.366C458.245 570.231 449.393 571.6 439.951 572.393C430.508 573.186 420.659 573.388 410.967 572.989C401.274 572.589 391.928 571.595 383.461 570.063C374.995 568.532 367.575 566.493 361.624 564.063C355.673 561.633 351.308 558.859 348.779 555.9C346.25 552.941 345.605 549.855 346.883 546.819C348.16 543.782 351.335 540.854 356.225 538.201C361.111 535.548 367.617 533.223 375.372 531.358C383.127 529.493 391.979 528.125 401.421 527.332C410.864 526.539 420.713 526.336 430.406 526.736C440.098 527.135 449.444 528.129 457.911 529.661C466.377 531.192 473.798 533.231 479.749 535.662C485.699 538.092 490.064 540.865 492.593 543.824C495.123 546.783 495.767 549.869 494.489 552.906C493.212 555.942 490.037 558.871 485.148 561.523Z" fill="#00527F"/>
        <path id="path2775_4" fill-rule="evenodd" clip-rule="evenodd" d="M458.183 548.039L448.837 553.111L481.962 559.103L475.732 562.484L442.607 556.492L433.262 561.563L427.05 551.424L458.183 548.039Z" fill="white"/>
        <path id="path4757_4" fill-rule="evenodd" clip-rule="evenodd" d="M408.11 538.161L398.764 543.232L365.64 537.24L359.41 540.621L392.534 546.613L383.189 551.685L414.321 548.301L408.11 538.161Z" fill="white"/>
        <path id="path4759_4" fill-rule="evenodd" clip-rule="evenodd" d="M417.245 564.034L404.296 561.691L423.42 551.313L414.787 549.751L395.663 560.13L382.714 557.787L389.199 566.761L417.245 564.034Z" fill="white"/>
        <path id="path4761_4" fill-rule="evenodd" clip-rule="evenodd" d="M458.658 541.937L445.708 539.595L426.584 549.973L417.952 548.412L437.076 538.033L424.127 535.691L452.173 532.964L458.658 541.937Z" fill="white"/>
        </g>
        <path id="path3798_4" d="M419.085 526.546C393.951 526.722 369.716 530.888 356.228 538.208C349.568 541.823 346.347 545.755 346.246 549.651H346.231V596.947H346.246C346.313 604.986 359.647 612.805 383.466 617.114C419.067 623.554 464.59 619.72 485.145 608.565C491.906 604.896 495.12 600.9 495.126 596.947V549.93C495.171 541.855 481.826 533.987 457.906 529.66C445.668 527.446 432.25 526.454 419.085 526.546Z" stroke="white"/>
        <path id="D" d="M417.4 585.536C419.768 585.536 421.837 586.005 423.608 586.944C425.379 587.883 426.744 589.205 427.704 590.912C428.685 592.597 429.176 594.549 429.176 596.768C429.176 598.965 428.685 600.917 427.704 602.624C426.744 604.331 425.368 605.653 423.576 606.592C421.805 607.531 419.747 608 417.4 608H408.984V585.536H417.4ZM417.048 603.264C419.117 603.264 420.728 602.699 421.88 601.568C423.032 600.437 423.608 598.837 423.608 596.768C423.608 594.699 423.032 593.088 421.88 591.936C420.728 590.784 419.117 590.208 417.048 590.208H414.456V603.264H417.048Z" fill="#FBFFFE"/>
        </g>
        <g id="Router-A">
        <g id="RA">
        <g id="g3813_5">
        <path id="path3759_5" d="M636.23 31.645V78.9412H636.246C636.312 86.98 649.646 94.7993 673.466 99.1081C709.067 105.548 754.59 101.714 775.144 90.5596C781.906 86.8903 785.119 82.8941 785.126 78.9412V31.7625C785.103 35.7058 781.889 39.6914 775.144 43.3515C754.59 54.5061 709.067 58.3255 673.466 51.8854C649.561 47.5611 636.217 39.7141 636.246 31.645H636.23Z" fill="url(#paint4_linear_11_117)"/>
        <path id="path4755_5" d="M775.148 43.5229C770.261 46.1759 763.755 48.5013 756 50.3664C748.245 52.2314 739.394 53.5996 729.951 54.3927C720.508 55.1857 710.659 55.3882 700.967 54.9886C691.274 54.589 681.928 53.595 673.462 52.0635C664.995 50.532 657.575 48.4929 651.624 46.0627C645.673 43.6325 641.308 40.8589 638.779 37.9001C636.25 34.9413 635.605 31.8555 636.883 28.8187C638.161 25.7819 641.335 22.8537 646.225 20.2013C651.111 17.5483 657.617 15.2229 665.372 13.3579C673.127 11.4928 681.979 10.1247 691.422 9.3316C700.864 8.53851 710.713 8.336 720.406 8.73565C730.098 9.13529 739.445 10.1293 747.911 11.6608C756.377 13.1923 763.798 15.2314 769.749 17.6616C775.7 20.0917 780.064 22.8654 782.593 25.8242C785.123 28.7829 785.767 31.8688 784.489 34.9056C783.212 37.9424 780.038 40.8705 775.148 43.5229Z" fill="#00527F"/>
        <path id="path2775_5" fill-rule="evenodd" clip-rule="evenodd" d="M748.183 30.0394L738.837 35.1109L771.962 41.103L765.732 44.484L732.607 38.4919L723.262 43.5634L717.051 33.4237L748.183 30.0394Z" fill="white"/>
        <path id="path4757_5" fill-rule="evenodd" clip-rule="evenodd" d="M698.11 20.1608L688.764 25.2324L655.64 19.2403L649.41 22.6213L682.534 28.6134L673.189 33.6849L704.321 30.3005L698.11 20.1608Z" fill="white"/>
        <path id="path4759_5" fill-rule="evenodd" clip-rule="evenodd" d="M707.245 46.0337L694.296 43.6913L713.42 33.3126L704.787 31.751L685.663 42.1297L672.714 39.7872L679.199 48.7607L707.245 46.0337Z" fill="white"/>
        <path id="path4761_5" fill-rule="evenodd" clip-rule="evenodd" d="M748.658 23.9373L735.708 21.5949L716.584 31.9733L707.952 30.4116L727.076 20.0333L714.127 17.6908L742.173 14.9636L748.658 23.9373Z" fill="white"/>
        </g>
        <path id="path3798_5" d="M709.085 8.54602C683.951 8.72247 659.716 12.8883 646.228 20.2085C639.568 23.8228 636.347 27.7555 636.246 31.6507H636.231V78.9468H636.246C636.313 86.9857 649.647 94.805 673.466 99.1138C709.067 105.554 754.59 101.72 775.145 90.5652C781.906 86.896 785.12 82.8997 785.126 78.9468V31.9297C785.171 23.8554 771.826 15.9869 747.906 11.6599C735.668 9.44616 722.25 8.4536 709.085 8.54602Z" stroke="white"/>
        </g>
        <path id="A" d="M712.968 83.032H704.584L703.24 87H697.512L705.64 64.536H711.976L720.104 87H714.312L712.968 83.032ZM711.56 78.808L708.776 70.584L706.024 78.808H711.56Z" fill="#FBFFFE"/>
        </g>
        <g id="Router-F">
        <g id="RF">
        <g id="g3813_6">
        <path id="path3759_6" d="M642.23 810.645V857.941H642.246C642.312 865.98 655.646 873.799 679.466 878.108C715.067 884.548 760.59 880.714 781.144 869.56C787.906 865.89 791.119 861.894 791.126 857.941V810.762C791.103 814.706 787.889 818.691 781.144 822.352C760.59 833.506 715.067 837.325 679.466 830.885C655.561 826.561 642.217 818.714 642.246 810.645H642.23Z" fill="url(#paint5_linear_11_117)"/>
        <path id="path4755_6" d="M781.148 822.523C776.261 825.176 769.755 827.501 762 829.366C754.245 831.231 745.394 832.6 735.951 833.393C726.508 834.186 716.659 834.388 706.967 833.989C697.274 833.589 687.928 832.595 679.462 831.063C670.995 829.532 663.575 827.493 657.624 825.063C651.673 822.633 647.308 819.859 644.779 816.9C642.25 813.941 641.605 810.855 642.883 807.819C644.161 804.782 647.335 801.854 652.225 799.201C657.111 796.548 663.617 794.223 671.372 792.358C679.127 790.493 687.979 789.125 697.422 788.332C706.864 787.539 716.713 787.336 726.406 787.736C736.098 788.135 745.445 789.129 753.911 790.661C762.377 792.192 769.798 794.231 775.749 796.662C781.7 799.092 786.064 801.865 788.593 804.824C791.123 807.783 791.767 810.869 790.489 813.906C789.212 816.942 786.038 819.871 781.148 822.523Z" fill="#00527F"/>
        <path id="path2775_6" fill-rule="evenodd" clip-rule="evenodd" d="M754.183 809.039L744.837 814.111L777.962 820.103L771.732 823.484L738.607 817.492L729.262 822.563L723.051 812.424L754.183 809.039Z" fill="white"/>
        <path id="path4757_6" fill-rule="evenodd" clip-rule="evenodd" d="M704.11 799.161L694.764 804.232L661.64 798.24L655.41 801.621L688.534 807.613L679.189 812.685L710.321 809.301L704.11 799.161Z" fill="white"/>
        <path id="path4759_6" fill-rule="evenodd" clip-rule="evenodd" d="M713.245 825.034L700.296 822.691L719.42 812.313L710.787 810.751L691.663 821.13L678.714 818.787L685.199 827.761L713.245 825.034Z" fill="white"/>
        <path id="path4761_6" fill-rule="evenodd" clip-rule="evenodd" d="M754.658 802.937L741.708 800.595L722.584 810.973L713.952 809.412L733.076 799.033L720.127 796.691L748.173 793.964L754.658 802.937Z" fill="white"/>
        </g>
        </g>
        <path id="F" d="M721.608 846.536V850.92H712.456V855.656H719.304V859.912H712.456V869H706.984V846.536H721.608Z" fill="#FBFFFE"/>
        </g>
        <path id="AB3" d="M1041.63 115.232C1041.72 112.949 1042.46 111.189 1043.87 109.952C1045.28 108.715 1047.19 108.096 1049.6 108.096C1051.2 108.096 1052.57 108.373 1053.7 108.928C1054.85 109.483 1055.71 110.24 1056.29 111.2C1056.89 112.16 1057.18 113.237 1057.18 114.432C1057.18 115.84 1056.83 116.992 1056.13 117.888C1055.42 118.763 1054.6 119.36 1053.66 119.68V119.808C1054.88 120.213 1055.84 120.885 1056.54 121.824C1057.25 122.763 1057.6 123.968 1057.6 125.44C1057.6 126.763 1057.29 127.936 1056.67 128.96C1056.07 129.963 1055.19 130.752 1054.02 131.328C1052.86 131.904 1051.49 132.192 1049.89 132.192C1047.33 132.192 1045.28 131.563 1043.74 130.304C1042.23 129.045 1041.43 127.147 1041.34 124.608H1046.66C1046.68 125.547 1046.94 126.293 1047.46 126.848C1047.97 127.381 1048.71 127.648 1049.7 127.648C1050.53 127.648 1051.17 127.413 1051.62 126.944C1052.09 126.453 1052.32 125.813 1052.32 125.024C1052.32 124 1051.99 123.264 1051.33 122.816C1050.69 122.347 1049.65 122.112 1048.22 122.112H1047.2V117.664H1048.22C1049.31 117.664 1050.19 117.483 1050.85 117.12C1051.53 116.736 1051.87 116.064 1051.87 115.104C1051.87 114.336 1051.66 113.739 1051.23 113.312C1050.81 112.885 1050.22 112.672 1049.47 112.672C1048.66 112.672 1048.05 112.917 1047.65 113.408C1047.26 113.899 1047.04 114.507 1046.98 115.232H1041.63Z" fill="#00527F"/>
        <path id="AC4" d="M336.568 127.84V123.424L346.68 108.96H352.792V123.104H355.416V127.84H352.792V132H347.32V127.84H336.568ZM347.704 114.976L342.328 123.104H347.704V114.976Z" fill="#00527F"/>
        <path id="CD1" d="M220.864 419.728V414.64H229.728V438H224.032V419.728H220.864Z" fill="#00527F"/>
        <path id="BE6" d="M1223.99 420.944C1223.82 420.155 1223.52 419.568 1223.1 419.184C1222.67 418.779 1222.06 418.576 1221.27 418.576C1220.06 418.576 1219.18 419.109 1218.65 420.176C1218.11 421.221 1217.84 422.885 1217.82 425.168C1218.29 424.421 1218.96 423.835 1219.83 423.408C1220.73 422.981 1221.71 422.768 1222.78 422.768C1224.87 422.768 1226.54 423.429 1227.8 424.752C1229.08 426.075 1229.72 427.92 1229.72 430.288C1229.72 431.845 1229.4 433.211 1228.76 434.384C1228.14 435.557 1227.22 436.475 1226.01 437.136C1224.81 437.797 1223.39 438.128 1221.75 438.128C1218.47 438.128 1216.18 437.104 1214.9 435.056C1213.62 432.987 1212.98 430.021 1212.98 426.16C1212.98 422.107 1213.66 419.099 1215 417.136C1216.37 415.152 1218.54 414.16 1221.53 414.16C1223.13 414.16 1224.47 414.48 1225.56 415.12C1226.67 415.739 1227.5 416.56 1228.06 417.584C1228.63 418.608 1228.97 419.728 1229.08 420.944H1223.99ZM1221.46 427.088C1220.55 427.088 1219.78 427.365 1219.16 427.92C1218.56 428.453 1218.26 429.221 1218.26 430.224C1218.26 431.248 1218.54 432.048 1219.1 432.624C1219.67 433.2 1220.48 433.488 1221.53 433.488C1222.47 433.488 1223.2 433.211 1223.74 432.656C1224.29 432.08 1224.57 431.301 1224.57 430.32C1224.57 429.317 1224.3 428.528 1223.77 427.952C1223.23 427.376 1222.47 427.088 1221.46 427.088Z" fill="#00527F"/>
        <path id="EF5" d="M940.888 731.408H930.904V735.824C931.331 735.355 931.928 734.971 932.696 734.672C933.464 734.373 934.296 734.224 935.192 734.224C936.792 734.224 938.115 734.587 939.16 735.312C940.227 736.037 941.005 736.976 941.496 738.128C941.987 739.28 942.232 740.528 942.232 741.872C942.232 744.368 941.528 746.352 940.12 747.824C938.712 749.275 936.728 750 934.168 750C932.461 750 930.979 749.712 929.72 749.136C928.461 748.539 927.491 747.717 926.808 746.672C926.125 745.627 925.752 744.421 925.688 743.056H931.032C931.16 743.717 931.469 744.272 931.96 744.72C932.451 745.147 933.123 745.36 933.976 745.36C934.979 745.36 935.725 745.04 936.216 744.4C936.707 743.76 936.952 742.907 936.952 741.84C936.952 740.795 936.696 739.995 936.184 739.44C935.672 738.885 934.925 738.608 933.944 738.608C933.219 738.608 932.621 738.789 932.152 739.152C931.683 739.493 931.373 739.952 931.224 740.528H925.944V726.608H940.888V731.408Z" fill="#00527F"/>
        <path id="CB2" d="M702.248 238.616C702.973 238.04 703.304 237.773 703.24 237.816C705.331 236.088 706.973 234.669 708.168 233.56C709.384 232.451 710.408 231.288 711.24 230.072C712.072 228.856 712.488 227.672 712.488 226.52C712.488 225.645 712.285 224.963 711.88 224.472C711.475 223.981 710.867 223.736 710.056 223.736C709.245 223.736 708.605 224.045 708.136 224.664C707.688 225.261 707.464 226.115 707.464 227.224H702.184C702.227 225.411 702.611 223.896 703.336 222.68C704.083 221.464 705.053 220.568 706.248 219.992C707.464 219.416 708.808 219.128 710.28 219.128C712.819 219.128 714.728 219.779 716.008 221.08C717.309 222.381 717.96 224.077 717.96 226.168C717.96 228.451 717.181 230.573 715.624 232.536C714.067 234.477 712.083 236.376 709.672 238.232H718.312V242.68H702.248V238.616Z" fill="#00527F"/>
        <path id="AE4" d="M916.568 352.84V348.424L926.68 333.96H932.792V348.104H935.416V352.84H932.792V357H927.32V352.84H916.568ZM927.704 339.976L922.328 348.104H927.704V339.976Z" fill="#00527F"/>
        <path id="AD9" d="M509.328 343.152C509.648 344.837 510.629 345.68 512.272 345.68C513.403 345.68 514.203 345.179 514.672 344.176C515.141 343.173 515.376 341.541 515.376 339.28C514.907 339.941 514.267 340.453 513.456 340.816C512.645 341.179 511.739 341.36 510.736 341.36C509.371 341.36 508.155 341.083 507.088 340.528C506.021 339.952 505.179 339.109 504.56 338C503.963 336.869 503.664 335.504 503.664 333.904C503.664 332.325 503.984 330.949 504.624 329.776C505.285 328.603 506.213 327.696 507.408 327.056C508.624 326.416 510.053 326.096 511.696 326.096C514.853 326.096 517.061 327.077 518.32 329.04C519.579 331.003 520.208 333.893 520.208 337.712C520.208 340.485 519.952 342.779 519.44 344.592C518.949 346.384 518.107 347.749 516.912 348.688C515.739 349.627 514.128 350.096 512.08 350.096C510.459 350.096 509.072 349.776 507.92 349.136C506.789 348.496 505.915 347.653 505.296 346.608C504.699 345.563 504.357 344.411 504.272 343.152H509.328ZM511.984 337.04C512.88 337.04 513.595 336.773 514.128 336.24C514.661 335.685 514.928 334.939 514.928 334C514.928 332.976 514.651 332.187 514.096 331.632C513.541 331.077 512.795 330.8 511.856 330.8C510.917 330.8 510.171 331.088 509.616 331.664C509.083 332.219 508.816 332.987 508.816 333.968C508.816 334.885 509.083 335.632 509.616 336.208C510.171 336.763 510.96 337.04 511.984 337.04Z" fill="#00527F"/>
        <path id="DE3" d="M712.632 607.232C712.717 604.949 713.464 603.189 714.872 601.952C716.28 600.715 718.189 600.096 720.6 600.096C722.2 600.096 723.565 600.373 724.696 600.928C725.848 601.483 726.712 602.24 727.288 603.2C727.885 604.16 728.184 605.237 728.184 606.432C728.184 607.84 727.832 608.992 727.128 609.888C726.424 610.763 725.603 611.36 724.664 611.68V611.808C725.88 612.213 726.84 612.885 727.544 613.824C728.248 614.763 728.6 615.968 728.6 617.44C728.6 618.763 728.291 619.936 727.672 620.96C727.075 621.963 726.189 622.752 725.016 623.328C723.864 623.904 722.488 624.192 720.888 624.192C718.328 624.192 716.28 623.563 714.744 622.304C713.229 621.045 712.429 619.147 712.344 616.608H717.656C717.677 617.547 717.944 618.293 718.456 618.848C718.968 619.381 719.715 619.648 720.696 619.648C721.528 619.648 722.168 619.413 722.616 618.944C723.085 618.453 723.32 617.813 723.32 617.024C723.32 616 722.989 615.264 722.328 614.816C721.688 614.347 720.653 614.112 719.224 614.112H718.2V609.664H719.224C720.312 609.664 721.187 609.483 721.848 609.12C722.531 608.736 722.872 608.064 722.872 607.104C722.872 606.336 722.659 605.739 722.232 605.312C721.805 604.885 721.219 604.672 720.472 604.672C719.661 604.672 719.053 604.917 718.648 605.408C718.264 605.899 718.04 606.507 717.976 607.232H712.632Z" fill="#00527F"/>
        <path id="DF7" d="M528.352 725.736L520.32 745H514.72L522.848 726.344H512.896V721.672H528.352V725.736Z" fill="#00527F"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_11_117" x1="1255.23" y1="270.939" x2="1404.13" y2="270.939" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_11_117" x1="27.2303" y1="253.939" x2="176.125" y2="253.939" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_11_117" x1="948.23" y1="588.939" x2="1097.13" y2="588.939" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint3_linear_11_117" x1="346.23" y1="584.939" x2="495.125" y2="584.939" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint4_linear_11_117" x1="636.23" y1="66.9392" x2="785.126" y2="66.9392" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        <linearGradient id="paint5_linear_11_117" x1="642.23" y1="845.939" x2="791.126" y2="845.939" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00527F"/>
        <stop offset="1" stop-color="#8AAAC0"/>
        </linearGradient>
        </defs>
        </svg>`;
      }else{
        vHTML=`error`;
      }

    return vHTML;

}



