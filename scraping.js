const puppeteer = require('puppeteer');
const mysql = require('mysql');


//EST
offset = -5.0

clientDate = new Date();
utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
const datetime = new Date( (utc + (3600000*offset)) );
const datenow = datetime.getFullYear() + "-" + ( '0' + (datetime.getMonth() + 1) ).slice(-2) + "-" + ( '0' + (datetime.getDate() ) ).slice(-2);





//local
var con = mysql.createConnection({
  host: "ls-ec144a8c10cc53619fa57000c587dc662caf8079.c4ikhf9dab2e.us-west-2.rds.amazonaws.com",
  user: "dbmasteruser",
  password: "+ivC~QyK6cPDmod>SqnxLqrKVgO}?7Md",
  database: "dbmaster"
});



// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "scrape_smsales"
// });



con.connect(function(err) {
  if (err) throw err;
  
});

const insert_data = [];
(async () => {

	



	


	var users = {
		'Alberto' : { 
			'email': 'alberto@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Alcy' : { 
			'email': 'alcym@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'bryn' : { 
			'email': 'bdiaz@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Caitlin' : { 
			'email': 'caitlin@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Carmen' : { 
			'email': 'carmen@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Courtney' : { 
			'email': 'courtney@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'daphny' : { 
			'email': 'dfrederick@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Dominique' : { 
			'email': 'dgivens@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Erika' : { 
			'email': 'erikas@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Gabriel' : { 
			'email': 'gabriels@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Jessica' : { 
			'email': 'jess@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Kimberly' : { 
			'email': 'kimberlyk@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'lauren' : { 
			'email': 'laureng@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'leandro' : { 
			'email': 'leandrom@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Natasha' : { 
			'email': 'natashav@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Racheal' : { 
			'email': 'racheal@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Rose' : { 
			'email': 'rose@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Samuel' : { 
			'email': 'samueld@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'shawn' : { 
			'email': 'shawnh@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Sydnee' : { 
			'email': 'sydneea@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Tyrel' : { 
			'email': 'tdenny@coverageoneinsurance.com',
			'password': 'Password1'
		},
		'Warren' : { 
			'email': 'warren@coverageoneinsurance.com',
			'password': 'Password1'
		}
	};


	for (let [name, value] of Object.entries( users )) {
		var email = users[name]['email'];
		var password = users[name]['password'];
		var has_query = false;
		var str_rec = new Array();













		let url = "https://seniormarketsales8.destinationrx.com/PC/2021/Account/Login";
		let urltocrawl = "https://seniormarketsales8.destinationrx.com/PC/2021/Account/Overview";

		//local
		//let browser = await puppeteer.launch( { headless: false } );
		

		const browser = await puppeteer.launch({
		    headless:true,
		    args: ["--no-sandbox"]
		});


		let page = await browser.newPage();

		await page.setViewport({width: 1200, height: 720});

		await page.goto(url, { waitUntil: 'networkidle0' });


		await page.type('input[formcontrolname=username]', email );
		await page.type('input[formcontrolname=password]', password );

		// click and wait for navigation
		try {
		  	await Promise.all([
			    page.click('button[type=submit]'),
			    page.waitForNavigation({ waitUntil: 'networkidle2' }),
			]);
		} catch (error) {
			console.log( "Invalid credentials for user: "+name );
			// return;
		}
		

		await page.goto(urltocrawl, { waitUntil: 'networkidle0' });

		var sel = 'table[class="active-selling-permissions-table table Spa_Style_Small_Font"] tr';



		var total_data = [];
		var has_value = true;

		while (has_value  == true) {



	    	try {
			  await Promise.all([ page.click(
			  	'button[id="pendo-button-412eff35"]'), 
			  ]);
			} catch (error) {
			}


			let data = await page.evaluate((sel) => {

		        const rows = document.querySelectorAll(sel);

				return Array.from(rows, row => {
					const columns = row.querySelectorAll('td');
					return Array.from(columns, column => column.innerText);
				});

		    }, sel);




		    if( data.length > 1 ){
		    	//has value

		    	total_data = total_data.concat(data);


		    	try {
				  await Promise.all([ page.click(
				  	'a[aria-label="Next"][class="page-link"]'), 
				  ]);
				} catch (error) {
				  has_value = false;
				}

		    } else {

		    	has_value = false;

		    }






		}


		var return_data = total_data.filter(function (el) {
			return el.length != 0;
		});




		if( return_data.length > 0 ){


			//insert_data[ name ] = return_data;
			var sales_query = 'INSERT INTO sales3 ( user, carrier, state, plan_type, plan_effective_startdate, plan_effective_enddate ) VALUES ';



			//query for current data in database to filter ;ater
			var select_records = 'SELECT * FROM sales3';
			
			var check_data = await con.query(select_records, function (err, result) {
				if (err) throw err;

				for (let row of result){

					//str_rec = str_rec+',"'+row.id+'","'+row.user+'","'+row.carrier+'","'+row.state+'","'+row.plan_type+'","'+row.plan_effective_startdate+'","'+row.plan_effective_enddate+'"';
					str_rec.push( '"'+row.user+'","'+row.carrier+'","'+row.state+'","'+row.plan_type+'","'+row.plan_effective_startdate+'","'+row.plan_effective_enddate+'"' );
				}








				var x = 0;
				for (let row of return_data){


					if( x > 0 ) var row_data = ',("'+name+'"'; 
					else var row_data = '("'+name+'"'; 


					//Check if already in query or have duplicate
					if( x > 0 ) var row_data1 = ',("'+name+'"'; 
					else var row_data1 = '("'+name+'"'; 

					if( x > 0 ) var row_data2 = ',("'+name+'"'; 
					else var row_data2 = '("'+name+'"'; 


					var row_data3 = '"'+name+'"'; 
					//Check if already in query or have duplicate/////






					for (let col of row){

						row_data = row_data+',"'+col+'"';



						//Check if already in query or have duplicate
						row_data1 = row_data1+',"'+col+'"';
						row_data2 = row_data2+',"'+col+'"';
						row_data3 = row_data3+',"'+col+'"';
						//Check if already in query or have duplicate/////


					}



					row_data = row_data+")";



					//Check if already in query or have duplicate
					row_data1 = row_data1+")";
					row_data2 = row_data2+")";
					//Check if already in query or have duplicate/////






					if(str_rec.indexOf( row_data3 ) == -1)
					{  
					   	x = x+1;

					   	row_data = ',"'+datenow+'"';

						sales_query = sales_query+row_data; //add row to query line for bulk add
						has_query = true;

					}





					
					
					


					/*
					//Check if already in query or have duplicate
					if( sales_query.includes(row_data1) == true || sales_query.includes(row_data2) == true || str_rec.includes(row_data3) == true ){ //this will check if already in database

					} else {
						//if in database

						//set if first array in query and add to query
						x = x+1;
						//

						sales_query = sales_query+row_data; //add row to query line for bulk add
						has_query = true;
					}*/


				}

				


				//if has query to query
				if( has_query ){


					//insert data to database
					con.query(sales_query, function (err, result) {
						if (err) throw err;

						var result_count = JSON.parse(JSON.stringify(result.affectedRows));


						if( result_count > 0 ){
							console.log( result.affectedRows+" total sales inserted for user: "+name+". at Datetime: "+datetime );
						} else {
							console.log( "0 total sales inserted for user: "+name+". at Datetime: "+datetime );
						}
						
					});
				} else {
					console.log( "0 total sales inserted for user: "+name+". at Datetime: "+datetime );
				}


			});









			



			
			


		}
		

		debugger;

		await browser.close();










	}





	con.destroy();
	console.log("Scraping finished.");


})();