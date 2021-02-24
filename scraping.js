const puppeteer = require('puppeteer');
const mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "scrape_smsales"
});

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

		













		let url = "https://seniormarketsales8.destinationrx.com/PC/2021/Account/Login";
		let urltocrawl = "https://seniormarketsales8.destinationrx.com/PC/2021/Account/Overview";

		//let browser = await puppeteer.launch( { headless: false } );
		let browser = await puppeteer.launch();
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
			var sales_query = 'INSERT INTO sales ( user, carrier, state, plan_type, plan_effective_startdate, plan_effective_enddate ) VALUES ';

			var x = 0;
			for (let row of return_data){


				if( x > 0 ) var row_data = ',("'+name+'"';
				else var row_data = '("'+name+'"';

				x = x+1;


				for (let col of row){
					row_data = row_data+', "'+col+'"';
				}

				row_data = row_data+")";

				sales_query = sales_query+row_data;

			}



			//insert data to database
			con.query(sales_query, function (err, result) {
				if (err) throw err;
				console.log( return_data.length+" total sales inserted for user: "+name+"." );
			});


		}
		

		debugger;

		await browser.close();










	}





	con.destroy();
	console.log("Scraping finished.");


})();