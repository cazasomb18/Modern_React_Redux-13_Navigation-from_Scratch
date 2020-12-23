//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Section 13 - NAVIGATION FROM SCRATCH

//Navigation in React
	//Navigation: show different sets of components when the URL changes
		//i.e. localhost:3000/dropdown --> dropdown component
			//localhost:3000/ --> show accordion (this is our root)

	//Do do this we usually use this react router library - standard for implementing navigation:
		//HOWEVER
			//React Router has frequent breaking changes almost every year
				//-->you'll have to learn it many times...
			//More important to learn the ideas and theory of navigation
			//We are going to build some navigation stuff from scratch!
				//--> will NOT USE REACT ROUTER IN THIS SECTION
			//React-Router will be covered later in the course!!!



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Basic Component Rendering
	//We'll no implement some navigation into react, 1st thing will not be exactly correct, will lead us into
	//a progression that will show the correct way.

	//Let's show some appropriate component on screen based on the url:
		//in browser, manuall navigation to localhost:3000/translate
			//in console. enter window.location;
			//location: object built into your browser, this will be updated everytime we navigate to a different url
				//the property we care about is location.pathname
					//--> everything inside url after domain and port

	//Here's what we REALLY want to do:
		//window.location.pathname==='/' --> Accordion
		//window.location.pathname==='/list' --> Search
		//window.location.pathname==='/dropdown' --> Dropdown
		//window.location.pathname==='/translate' --> Translate

	//in App.js, define a series of different functions, in each one we'll do the comparisons above:
		//showAccordion:
			const showAccordion = () => {
				if (window.location.pathname === '/') {
					return <Accordion items={items}/>
				}	
			};
		//To test, in return statement, delete <Translate/> and replace with:
			{showAccordion()}
				//okay so this works, we've successfully set this up for '/' to be Accordion.js;

		//Now let's build out similar functions to show the other components:
		const showList = () => {
			if (window.loaction.pathname === '/list') {
				return <Search />;
			}
		};

		const showDropdown = () => {
			if (window.location.pathname === '/dropdown') {
				return <Dropdown />;
			}
		};

		const showTranslate = () => {
			if (window.location.pathname === '/translate') {
				return <Translate />;
			}
		};

		//And call these in the return statement:
		return (
			<div>
				{showAccordion()}
				{showList()}
				{showDropdown()}
				{showTranslate()}
			</div>
		);

		//Not we have some basic routing, however there cons:
			//We have repetitive logic, they are the same kind of check, therefore we could condense this down
			//and make it more compact... this is the goal of the next video.






//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Building a Reusable Route Component
	//make a component to decide when to show another component based upon the pathname:
		//In components dir, create route.js, import react, export react
		//Route probably needs to different props:
			//path - when we want to show some component
			//children - component that we'll conditionally display
		const Route = ({ path, children }) => {
			return window.location.pathname === path 
				? children
				: null;
		};
		//import Route.js in App.js, replace all those previous function calls w/:
		<div>
			<Route path="/">
				<Accordion items={items}/>
			</Route>
			<Route path="/list">
				<Search />
			</Route>
			<Route path="/dropdown">
				<Dropdown />
			</Route>
			<Route path="/translate">
				<Translate />
			</Route>
		</div>
			//when we declare a prop to a child comp, the parent comp has that prop availble as 'children'
				//--> this is why we declared route to take in 'children' arg, very special prop

		//Now in Dropdown we need to add these properties: options, selected, onSelectedChange
			<Dropdown 
					label="Select a Color" 
					options={options} 
					selected={selected} 
					onSelectedChange={setSelected}
			/>
			//And now we'll initialize selected and setSelected with setState:
				const [selected, setSelected] = useState(options[0]);

			//All we did here was extract that routing logic into a reusable component
				//This are a lot of interesting things we can do when we insert this <Route/> comp:



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Implementing a Header for Navigation
	//Now we're going to put together the header > the thing that we click on to navigate to different widgets:

	//Create Header.js in components dir and set as functional component to return:
		return (
			<div className="ui secondary pointing menu">
				<a href="/" className='item'>
					Accordion
				</a>
				<a href="/list" className='item'>
					Search
				</a>
				<a href="/dropdown" className='item'>
					Dropdown
				</a>
				<a href="/translate" className='item'>
					Translate
				</a>
			</div>
		);
	//In App.js import Header, and render under first <div/> in return statement
		return (
			<div>
				<Header />
			</div>
		);
	//Now we can delete all the functions that we previously wrote in App.js (showTranslate(), showList(), etc.):





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Handling Navigation
	//Navigation isn't as good as it could be --> if we see all network requests, we'll be able to understand
	//that each time we navigate we are issuing a lot of different requests
		//Here's how traditional html pages do requests:

			//App 	--> Request 	Some Server
			//App 	<--	htmldoc		Some Server
					//user Clicks a link
			//App 	--> Request 	Some Server
			//App 	<-- htmldoc		Some Server

		//So whenver we make a request we are reloading the index.html file inside our project, and reload
		//all the JS and the CSS also
			//this is not ideal, no reason to do this in a React App

	//GOAL: when we click on a link we DO NOT want do a full page reload

	//Here's how it would work:
		//1 - User clicks 'list'
		//2 - Change URL, bug DO NOT do a full page reload
		//3 - Each route could detect the URL has changed
		//4 - Route could update piece of state tracking the current pathname
		//5 - Each route rerenders, showing/hiding component appropriately



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Building a Link
	//GOAL: DO NAVIGATION WITHOUT INITIALIZING A FULL PAGE RELOAD:

	//Header --> link
		//NAVIGATION EVENT
			//--> Route ==> Accordion
			//--> Route ==> List
			//--> Route ==> Dropdown
			//--> Route ==> Translate

		//When user clicks link, will attach onClick handler to execute special logic:
			//when user click link we'll build a navigation event, object that will communicate to app that url
			//has changed
				//Event then sent down to all different components in our app
					//They will know that the url has changed
						//decide whether or not to show respective child components

		//1 - Make new component called link
		//2 - Build up anchor element inside of it and attach an onclick handler
		//3 - whenever user clicks on anchor element we will emit navigation object
		//4 - we'll then listen for that navigation object in all our different routes

		//1 - create a new file in components directory called Link.js, set to functional comp, export
			//import at Header.js

		//2 - replace all <a/> tags w/ <Link/>
			//need to pass props in <a/>s from Link comp and pass them through to Header.js:
			const Link = ({ className, href, children }) => {
				return (
					 <a className={className} href={href}>
						{children}
					</a>
				);
			};
		//3 - Add onClick property to <a /> and delcare onClick above return in const Link, pass event arg:
			//Now we want to prevent a full page reload:
			event.preventDefault(); //prevents a fullpage reload
				//We have now completed step 1 - which is to make a reusable link comp that prevents a full
				//page reload.
					//Now we have to change the url without causing a fullpage refresh



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changing the URL
	//GOAL: Change the url without causing a full page refresh

	//Url must always be kept in sync with the page content, this is b/c we expect users to be able to bookmark
	//page and be able to navigate to that specific page

	//We'll use a built-in browser to change url and NOT do a full refresh, 
		//browser console: 
			//window.history.pushState({}, '', '/translate');
				//--> this change the browser to localhost:3000/translate without changing anything in our app
					//this works so let's add it into our e.preventDefault() handler, under e.preventDefault();
					window.history.pushState({}, '', href);

	//Now that we can change the url w/o altering anything else we need to make sure each route can detect url
	//changes
		//We need to produce and emit a NAVIGATION EVENT




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Detecting Navigation
	//GOAL: whenever user clicks link we will emit a navigation event sent to all Route components

	//We'll write code to tell dropdown comps that the URL has changed (under window.history...):
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
			//will communicate to Route components that url has changed..

	//Now in Route.js, let's listen for these events --> usually a sign that we need to do a useState hook:
		//import useState hook @ Route.js:
			import React, { useEffect } from 'react';
		//set up event listener to listen for changes to url, w/ onlocation change as second arg, define 2nd
		//arg above (do console.log inside) and finally remove eventListener w/ return statement:
		useEffect(() => {
			const onLocationChange = () => {
				console.log('LOCATION CHANGE')
			};

			window.addEventListener('popstate', onLocationChange);

			return () => {
				window.removeEventListener('popstate', onLocationChange);
			}
		}, []);

		//next goal: update piece of state w/ Route tracking the current pathname



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Updating the Route
	//GOAL: tell route comp to rerender each time onLocationChange function was called
		//to do: we'll determine pathname and use it to decide whether component rendered should display its
		//child or hide it.
		//We're going to create a piece of state that will track value of window.location.pathname
			//that prop (window.location.pathname) --> will always reflect current pathname,
				//This piece of state has the sole purpose of trying to get the app comp to rerender itself:

	//import useState, and declare state currentPath and setCurrentPath to equal window.location.pathname:
		const [currentPath, setCurrentPath] = useState(window.location.pathname);
	//replace console log and call setCurrentPath passing in window.location.pathname:
		const onLocationChange = () => {
			setCurrentPath(window.location.pathname);
		};
	//Now we can update the return statement with currentPath:
		return currentPath === path ? children : null;
		//error in Search --> can't perform update blah blah blah... that's b/c it's returning a response
		//once you ahve already navigated away === you're clicking too quickly, don't sweat it.
			//we have a small error in navigation, when you hold "command + click" the browser is not 
			//opening the url in a new window, we'll focus on this next.



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Handling Command Clicks
	//GOAL: create functinoality of opening new window when click link + command

	//In Link.js, 1st line of onClick = (event) => {}:
		if (event.metaKey || event.cntrlKey) {
			return;
		}//metaKey (command in mac), cntrlKey (control in windows)
			//that's it, now we can make use of this functionality
				//tested and it works
