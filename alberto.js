const puppeteer = require('puppeteer');
const mysql = require('mysql');


//EST
offset = -5.0

clientDate = new Date();
utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
const datetime = new Date( (utc + (3600000*offset)) );
const datenow = datetime.getFullYear() + "-" + ( '0' + (datetime.getMonth() + 1) ).slice(-2) + "-" + ( '0' + (datetime.getDate() ) ).slice(-2);





//local
// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "scrape_smsales"
// });


var con = mysql.createConnection({
  host: "ls-ec144a8c10cc53619fa57000c587dc662caf8079.c4ikhf9dab2e.us-west-2.rds.amazonaws.com",
  user: "dbmasteruser",
  password: "+ivC~QyK6cPDmod>SqnxLqrKVgO}?7Md",
  database: "dbmaster"
});



const insert_data = [];
(async () => {

	

	var users = {
		'Alberto' : { 
			'email': 'alberto@coverageoneinsurance.com',
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

		while (has_value  === true) {



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


			console.log( "." );


			//insert_data[ name ] = return_data;
			var sales_query = 'INSERT INTO sales4 ( user, carrier, state, plan_type, plan_effective_startdate, plan_effective_enddate, datetime ) VALUES ';



			//query for current data in database to filter ;ater
			var select_records = 'SELECT * FROM sales4';
			
			var check_data = await con.query(select_records, function (err, result) {
				if (err) throw err;


				console.log("..")

				for (let row of result){

					//str_rec = str_rec+',"'+row.id+'","'+row.user+'","'+row.carrier+'","'+row.state+'","'+row.plan_type+'","'+row.plan_effective_startdate+'","'+row.plan_effective_enddate+'"';
					str_rec.push( '"'+row.user+'","'+row.carrier+'","'+row.state+'","'+row.plan_type+'","'+row.plan_effective_startdate+'","'+row.plan_effective_enddate+'"' );
				}








				var x = 0;
				for (let row of return_data){


					if( x > 0 ) var row_data = ',("'+name+'"'; 
					else var row_data = '("'+name+'"'; 



					var row_data3 = '"'+name+'"'; 
					//Check if already in query or have duplicate/////






					for (let col of row){

						row_data = row_data+',"'+col+'"';



						//Check if already in query or have duplicate
						row_data3 = row_data3+',"'+col+'"';
						//Check if already in query or have duplicate/////


					}






					if(str_rec.indexOf( row_data3 ) == -1)
					{  
					   	x = x+1;

					   	row_data = row_data+',"'+datenow+'"';
					   	row_data = row_data+")";

						sales_query = sales_query+row_data; //add row to query line for bulk add
						has_query = true;

					}






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








			
			console.log("...");

		} else {
			console.log( "No data found on the url." );
			
			var test_query = 'INSERT INTO test ( `test`, `x` ) VALUES ( "test", "y" ) ';
			var test = await con.query(test_query, function (err, result) {
				if (err) throw err;

				console.log( ". at Datetime: "+datetime );
				
			});
		}
		

		//debugger;

		await browser.close();








	}





	con.destroy();
	console.log("Scraping finished.");


})();