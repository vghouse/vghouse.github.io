var API_KEY = 'abc';
var RESULTS_PER_PAGE = 5;
var SPREADSHEET_ID = '1NhIgmjBwTFeqM_faWUrBhlLtWsgjPQDfwH9-xRe1SFo';
var headings = ["timestamp","name","phone","email","product","id","product_id","price","call_1","status_1","call_2","status_2","call_3","status_3","result","last_time","note"];

function doGet(e) {
  if (!isAuthorized(e)) {
    return buildErrorResponse('not authorized');
  }
  
  var action = getActionParam(e).toLowerCase();
  var callback = e.parameter.callback;
  if ( action === "get" ) {
  
//    https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&id=ID006&action=get
      var id = getIDParam(e);
    
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);
      var dataFiltered = filter(dataWithHeadings, id);
    
      return buildSuccessResponse(dataFiltered);
    
  } else if ( action === "update" ) {
    
    var id = getIDParam(e);

//    https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&id=ID006&action=update&call_1=1&status_1=Nhấc máy&call_2=1&status_2=&call_3=&status_3=&result=Success&note=test hehe
    
    var cs = {};
    cs.call_1 = e.parameters.call_1[0];
    cs.status_1 = e.parameters.status_1[0];
    cs.call_2 = e.parameters.call_2[0];
    cs.status_2 = e.parameters.status_2[0];
    cs.call_3 = e.parameters.call_3[0];
    cs.status_3 = e.parameters.status_3[0];
    
    cs.result = e.parameters.result[0];
    cs.last_time = new Date();
    cs.note = e.parameters.note[0];
    
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var worksheet = spreadsheet.getSheets()[1];
    
    var rowToUpdate = updateById(id, worksheet);
    
    worksheet.getRange("I" + rowToUpdate + ":Q" + rowToUpdate).setValues([[cs.call_1, cs.status_1,cs.call_2,cs.status_2,cs.call_3,cs.status_3,cs.result,cs.last_time,cs.note]]);
    
    return buildSuccessResponse({"Updated": cs});
  } else if ( action === "newlead" ) {
      // https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&action=newlead
      
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);
      var dataFiltered = filterNewLead(dataWithHeadings);
    
      return buildSuccessResponse(dataFiltered);
  
  } else if ( action === "cache" ) {
      // https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&action=cache
      
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);  
    
      return buildSuccessResponse(dataWithHeadings);
  
  } else if ( action === "all" ) {
      // https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&action=all&page=1
      
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
//      var rows = worksheet.getDataRange().sort({column: 1, ascending: false}).getValues();
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);
    
      // sort by timestamp
      var dataSorted = dataWithHeadings.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    
      var page = Number(e.parameters['page'][0]);
      var paginated = paginate(dataSorted, page);
    
      return buildSuccessResponse(paginated);
  
  } else if ( action === "call1" ) {
//      https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&id=ID006&action=call1
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);
      var dataFiltered = filterCall1(dataWithHeadings);
    
      return buildSuccessResponse(dataFiltered);
  
  } else if ( action === "call2" ) {
//      https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&id=ID006&action=call2
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);
      var dataFiltered = filterCall2(dataWithHeadings);
    
      return buildSuccessResponse(dataFiltered);
  
  } else if ( action === "call3" ) {
//      https://script.google.com/macros/s/AKfycbydo_5UrWzxhIusxpcqcZ6JdN_U4prpVLlywqQTfjc/dev?key=abc&id=ID006&action=call3
      var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      var worksheet = spreadsheet.getSheets()[1];
      //  get lastrow in column A
      var Avals = worksheet.getRange("A1:A").getValues();
      var Alast = Avals.filter(String).length;
      
      var rows = worksheet.getDataRange().getValues();
      
      var data = rows.slice(1);
      var data = data.slice(0, Alast - 1);
      var dataWithHeadings = addHeadings(data, headings);
      var dataFiltered = filterCall3(dataWithHeadings);
    
      return buildSuccessResponse(dataFiltered);
  
  }
}

function updateById(id, sheet){

  var data = sheet.getDataRange().getValues();
  var Avals = sheet.getRange("A1:A").getValues();
  var Alast = Avals.filter(String).length;

  for(var i = 0; i< Alast;i++){
    if(data[i][5] == id){
      Logger.log((i+1))
      return i+1;
    }
  }
}

function addHeadings(dataBody, headings) {
  return dataBody.map(function(postAsArray) {
    var postAsObj = {};
    
    headings.forEach(function(heading, i) {
      postAsObj[heading] = postAsArray[i];
    });
    
    return postAsObj;
  });
}

function filter(data, id) {
  return data.filter(function(d) {
    return d['id'].toLowerCase() === id.toLowerCase();
  });
}

function filterNewLead(data) {
  return data.filter(function(d) {
    return d['call_1'].length == 0;
  });
}

function filterCall1(data) {
  return data.filter(function(d) {
    return d['call_1'] == 1;
  }).filter(function (e) {
    return e['call_2'].length == 0;
  }).filter(function (f) {
    return f['call_3'].length == 0;
  }).filter(function (g) {
    return g['result'].length == 0;
  });
}

function filterCall2(data) {
  return data.filter(function(d) {
    return d['call_1'] == 1;
  }).filter(function (e) {
    return e['call_2'] == 1;
  }).filter(function (f) {
    return f['call_3'].length == 0;
  }).filter(function (g) {
    return g['result'].length == 0;
  });
}

function filterCall3(data) {
  return data.filter(function(d) {
    return d['call_1'] == 1;
  }).filter(function (e) {
    return e['call_2'] == 1;
  }).filter(function (f) {
    return f['call_3'] == 1;
  }).filter(function (g) {
    return g['result'].length == 0;
  });
}

function isAuthorized(e) {
  return 'key' in e.parameters && e.parameters.key[0] === API_KEY;
}

function getPageParam(e) {
  if ('page' in e.parameters) {
    var page = parseInt(e.parameters['page'][0]);
    if (!isNaN(page) && page > 0) {
      return page;
    }
  }
  
  return 1
}

function getIDParam(e) {
  if ('id' in e.parameters) {
    return e.parameters['id'][0];
  }
  
  return null
}

function getActionParam(e) {
  if ('action' in e.parameters) {
    return e.parameters['action'][0];
  }
  
  return null
}

function paginate(posts, page) {
  var postsCopy = posts.slice();
  var postsChunked = [];
  var postsPaginated = {
    posts: [],
    count: posts.length,
    perPage: RESULTS_PER_PAGE,
    activePage: page,
    pages: {
      previous: null,
      next: null
    }
  };
  
  while (postsCopy.length > 0) {
    postsChunked.push(postsCopy.splice(0, RESULTS_PER_PAGE));
  }
  
  if (page - 1 in postsChunked) {
    postsPaginated.posts = postsChunked[page - 1];
  } else {
    postsPaginated.posts = [];
  }

  if (page > 1 && page <= postsChunked.length) {
    postsPaginated.pages.previous = page - 1;
  }
  
  if (page >= 1 && page < postsChunked.length) {
    postsPaginated.pages.next = page + 1;
  }
  
  return postsPaginated;
}

function buildSuccessResponse(data) {
  var output = JSON.stringify({
    status: 'success',
    data: data
  });
  
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

function buildErrorResponse(message) {
  var output = JSON.stringify({
    status: 'error',
    message: message
  });
  
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}