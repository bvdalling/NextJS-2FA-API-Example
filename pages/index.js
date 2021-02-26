import Head from 'next/head'
import {useState, useEffect} from 'react'


/**
 * Please note the API should be returning a session token that can be used
 * to ensure the user was actually verified. Otherwise a malicous actor 
 * can look through the code and cheat this. Just like any application you need 
 * measures in place to ensure only authenticated and valid users/services/machines
 * gain access to the resources. As this is only a mock up your API should provide those tokens 
 * to actually make this secure. Use at your own risk.
 */
export default function Home() {


	const [inputValues, setInputValues] = useState(Array(6).fill('', 0));
	const [isLoading, setIsLoading] = useState(false);
	const [codeIsValid, setCodeIsValid] = useState(false);
	const [message, setMessage] = useState(null);

	// Place the value into the array
	const handleDigitInput = (event) => {

		// Convert the id to int
		let input = parseInt(event.target.id);

		// Set our input value
		inputValues[input] = document.getElementById(input).value;

		// Update our state
		setInputValues(inputValues);

		// Move to the next empty box
		for(let i = 0; i < inputValues.length; i++) {
			if(inputValues[i] === null || inputValues[i] === '') {
				document.getElementById(i).focus();
				break;
			}
		}

		// Perform our Validation
		handleValidation();
	}


	// Place the value into the array
	const clearInput = (event) => {

		// Get all inputs
		let inputs = document.getElementsByTagName("input");

		// Clear the inputs
		for(let i = 0; i < inputs.length; i++) {
			inputs[i].value = "";
			
			// If it was marked valid before then remove the class
			if(inputs[i].classList.contains("valid")) {
				inputs[i].classList.remove("valid");
			}
		}

		// Update our state
		setInputValues(Array(6).fill('', 0));
	}

	const handleValidation = async (event) => {

		// Assume the code is valid 
		// until validation finishes.
		let isValid = true;

		// If this was the form being submitted
		if(event != undefined) {

			// Prevent actually submitting the form.
			event.preventDefault();
		}

		// Go through and check each input
		inputValues.map((value, index) => {

			// Check if input has a valid value
			if(value === null || value === '') {

				// If it was marked valid before then remove the class
				if(document.getElementById(index).classList.contains("valid")) {
					document.getElementById(index).classList.remove("valid");
				}

				// Tell the code not send validation request
				isValid = false;
				
				// Let the user correct the mistake
				return;
			} else {

				//  Add valid UI marking to indicate good input
				document.getElementById(index).classList += " valid";
			}
		});

		// Do API Call
		if(isValid) {

			// Remove element focus
			document.activeElement.blur();

			// Tell our page we are loading
			setIsLoading(true);

			const response = await fetch("https://mock-2fa-api.azure-api.net/validation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accepts": "application/json"
				},
				body: JSON.stringify({
					token: inputValues.join('')
				})
			})
			.then(resp => {
				try {
					return resp.json();
				} catch (e) {
					return JSON.stringify(false);
				}
			});
			
			// Check response 
			if(response) {
				setCodeIsValid(response);

				setTimeout(() => {
					window.location.reload();
				}, 3000);
			}

			// If there was a problem
			setMessage("Please Check Your Token.");
			setIsLoading(false);
		}
	}

	return (
	<div className="page-container">
		<div className="background"></div>
		{!codeIsValid ?
			
			<div className="form-container">

				<div className="w-full mt-2">
					<button className="p-2 text-gray text-lg" onClick={() => alert("This woould go back to your login screen.")}><i className="fa fa-arrow-left"></i> Go back</button>
				</div>

				<div className="">
					<img className="w-full p-5" src="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.png"/>
				</div>
				<span className="text-xl text-blue text-center">Please verify your account.</span>
				<p className="text-sm text-center text-gray">
					You will receive a 6 character code via [method]. 
				</p>

				{message ? 
					<p className="text-sm text-center text-red">
						{message}
					</p>
				: null }

				<form className="relative" onSubmit={handleValidation}>
					<div className={`confirmation mt-3 ${isLoading ? 'loading' : ''}`}>
						<input type="number" maxLength="1" onChange={handleDigitInput} id="0"/>
						<input type="number" maxLength="1" onChange={handleDigitInput} id="1"/>
						<input type="number" maxLength="1" onChange={handleDigitInput} id="2"/>
						<input type="number" maxLength="1" onChange={handleDigitInput} id="3"/>
						<input type="number" maxLength="1" onChange={handleDigitInput} id="4"/>
						<input type="number" maxLength="1" onChange={handleDigitInput} id="5"/>
					</div>
				</form>

				<div className="w-full mt-2 text-center">
					<button className="p-2 text-red mx-2" onClick={clearInput}>Clear Input</button>
					<button className="p-2 text-gray mx-2" onClick={() => alert("Demo API doesn't have resend code. But this would be included in a real 2FA setup.")}>Resend Code?</button>
				</div>
			</div> 
			:
			<div className="form-container">
				<div className="">
					<img className="w-full p-5" src="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.png"/>
				</div>
				<span className="text-xl text-green text-center">Account Verified</span>
				<p className="text-sm text-center text-gray">
					Your code was valid. Please wait while you are redirected. 
				</p>
			</div> }
	</div>
	)
}
