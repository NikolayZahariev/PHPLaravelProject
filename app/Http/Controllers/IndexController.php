<?php

namespace App\Http\Controllers;

use App\HyperlinkButton;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

/**
 * Class IndexController
 * @package App\Http\Controllers
 */
class IndexController extends Controller
{
    /**
     * Shows the main page and the list of buttons containing hyperlinks to the client.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view('/index')->with('hyperlinkButtons', HyperlinkButton::all());
    }

    /**
     * Adds the hyperlink buttons to the database or updates the existing ones.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store()
    {
        if ($this->buttonDataIsValid(request('websiteURL'), request('buttonColor'))) {

            // Get the ID button that is being edited and search for it in the database.
            $hyperlinkButton = HyperlinkButton::where('buttonID', '=', request('callingButtonID'))->first();

            // If the button object is null then the buttons does not exist in the database and therefore we must create a
            // new record for it.
            //
            // Else, we will just update the button record.
            if ($hyperlinkButton === null) {

                $hyperlinkButton = new HyperlinkButton();
                $hyperlinkButton->buttonID = request('callingButtonID');
                $hyperlinkButton->websiteTitle = request('websiteName');
                $hyperlinkButton->websiteLink = $this->formatButtonURL(request('websiteURL'));
                $hyperlinkButton->buttonColor = request('buttonColor');

            } else {

                $hyperlinkButton->setAttribute('websiteTitle', request('websiteName'));
                $hyperlinkButton->setAttribute('websiteLink', $this->formatButtonURL(request('websiteURL')));
                $hyperlinkButton->setAttribute('buttonColor', request('buttonColor'));
            }

            $hyperlinkButton->save();
        } else {

            $params = [
                'error' => 'Bad input',
                'error_description' => 'Your input was not valid, please try again.'
            ];

            response()->json($params, 422)->send();
        }
    }

    /**
     * Check if the received hyperlink button data is valid.
     *
     * Checks the website URL for validity by sending a request to it, if the request returns code 200 then the URL is
     * accurate.
     *
     * Checks the button color which must be a hex color code by checking the lenght of the string, which must be 7
     * (the pound symbol and the 6 characters), and whether the string includes only a pound character and letters and
     * numbers.
     *
     * @param string $websiteURL
     * @param string $buttonColor
     * @return bool
     */
    private function buttonDataIsValid(string $websiteURL, string $buttonColor)
    {

        $buttonColorIsValid = (ctype_xdigit(ltrim($buttonColor, '#')) && strlen($buttonColor) == 7);

        try {
            $client = new Client();
            $request = $client->head($websiteURL);
            $websiteUrlIsValid = $request->getStatusCode() == 200;
        } catch (GuzzleException  $e) {
            $websiteUrlIsValid = false;
        }

        return $buttonColorIsValid && $websiteUrlIsValid;
    }

    /**
     * Formats the given URL by checking if it includes "http://" or "https://". If it does not then this function
     * adds https:// to the URL.
     *
     * @param string $websiteURL - The URL we want to format.
     * @return string - The formatted URL.
     */
    private function formatButtonURL($websiteURL)
    {

        $parsed = parse_url($websiteURL);

        if (empty($parsed['scheme'])) {
            $websiteURL = 'https://' . ltrim(request('websiteURL'), '/');
        }

        return $websiteURL;
    }

    /**
     * Called when the user wants to delete a button containing a hyperlink. We delete that button's database record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteButton(Request $request)
    {
        HyperlinkButton::where('buttonID', '=', $request->hyperlinkButtonID)->delete();

        return response()->json([
            'success' => "success",
        ]);
    }
}
