var table = {};

function convert_input()
{
    var userInput = document.getElementById('mySavedModel').value;
    var user_input = JSON.parse(userInput);

    var s_state;
    var a_states = [];
    var n_state;

    //Get state attributes
    s_state = $('input:radio[name=s_state]:checked').val();
    
    $(".a_state:checked").each(function() {
		a_states.push($(this).val());
	});

    //Populating table with states
    for (state in user_input['nodeDataArray'])
    {
        var state_id = Math.abs(user_input['nodeDataArray'][state]['id']);
        table[state_id] = {};

        for (next in user_input['nodeDataArray'])
        {
            var next_state = Math.abs(user_input['nodeDataArray'][next]['id']);
            table[state_id][next_state] = null;

        }

        n_state = state;
     }
    
    for (transitions in user_input['linkDataArray'])
    {
        var obj = user_input['linkDataArray'][transitions];
        
        var i = Math.abs(obj['from']);
        var j = Math.abs(obj['to']);
        var trans = obj['text'];
            //go.js sometimes returns no text value, Epsilon as error in this case
            if (!trans){trans = "E"};

        table[i][j] = trans;
    }

    var expression = "";
   //Getting Regular Expression
   for (var s = 0; s < a_states.length; s++)
   {
       expression = expression + reg(s_state, a_states[s], n_state);
   }

   document.getElementById('user_input').innerHTML = "<h3>Regular Expression</h3><br><br>" + expression ;
   
}

function create_att()
{

    var doc = $('#states');

    var userInput = document.getElementById('mySavedModel').value;
    var user_input = JSON.parse(userInput);
    
    doc.append("<h2>DFA Attributes</h2><br>");
    doc.append("<p><strong>Choose a starting state</strong></p>");
    
    for (state in user_input['nodeDataArray'])
    {
        var name = user_input['nodeDataArray'][state]['text'];
        var state_id = Math.abs(user_input['nodeDataArray'][state]['id']);
        
        doc.append("<input type='radio' required='required' name='s_state' value='"+state_id+"'>"+name);    
    }
    
    doc.append("<br><br><p><strong>Choose accepting states</strong></p>");
    for (state in user_input['nodeDataArray'])
    {
        var name = user_input['nodeDataArray'][state]['text'];
        var state_id = Math.abs(user_input['nodeDataArray'][state]['id']);
        
        doc.append("<input type='checkbox' required='required' class='a_state' value='"+state_id+"'>"+name);    
    }

    doc.append("<br><br><button type='submit' value='Submit' onclick='convert_input();'>Continue</button>");
    doc.append("<button type='submit' value='Reset' onclick='history.go();'>Reset</button>");
    document.getElementById('go_input').style.display = "none";  
}

function reg(i,j,k)
{
    if (k == 0)
    {
        if (table[i][j] == null) { return ''; }
        return table[i][j];
    }

    return "(" + reg(i,j,k-1)+ ')' + "("+ reg(i,k,k-1) + " ("+reg(k,k,k-1)+")* "+reg(k,j,k-1) + " )";
}

