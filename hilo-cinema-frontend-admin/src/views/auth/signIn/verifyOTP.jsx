import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

function VerifyOTP() {
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push('/new-password');
    };

    return (
        <div class="max-w-md mx-auto border max-w-sm mt-20 rounded">
            <form class="shadow-md px-4 py-6">
                <div class="flex justify-center gap-2 mb-6">
                    <input class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required></input>
                    <input class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required></input>
                    <input class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required></input>
                    <input class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required></input>
                </div>
                <div class="flex items-center justify-center">
                    <button class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleSubmit}>
                        Verify
                    </button>
                    <button class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3" type="button" onClick={handleSubmit}>
                        Resend OTP
                    </button>
                </div>
            </form>
        </div>
    )
}

export default VerifyOTP