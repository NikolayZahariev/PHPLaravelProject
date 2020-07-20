<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <title>Javascript/PHP Task</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

    <!-- Styles -->
    <link href="/css/main.css" rel="stylesheet">

    <!-- Ajax -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- External JS file -->
    <script type="text/javascript" src="/js/app.js"></script>

    <!-- Embedded JS code -->
    <script type="text/javascript">

        // Set up the CSRF token for future AJAX requests
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        /**
         * Dynamically creates the page contents: the grid and its buttons.
         *
         * We need this function because of the JSON object we receive from the server which contains quotation marks.
         * This means we cannot put the call to the createButtonGrid() method diractly in the onLoad attribute of the
         * <body> because the quotations in the JSON object will cause us the escape the quotations of the onLoad and
         * breat the HTML.
         */
        function setUpPageContents() {

            createButtonGrid(3, 3, @json($hyperlinkButtons));
        }
    </script>

</head>
<body onload="setUpPageContents()">

<div class="flex-center position-ref full-height">
    <div id="buttonGridContainer"></div>
{{--    <div id="dialog-confirm"></div>--}}

    <!-- Modal that contains the form with which buttons are edited -->
    <div id="buttonEditModal" role="dialog" class="popup">
        <div class="overlay"></div>
        <div class="content">
            <form id="hyperlinkButtonForm" action="/" method="post" onsubmit="event.preventDefault(); submitForm();">
                @csrf
                <input type="hidden" name="callingButtonID" id="callingButtonID" value="">
                <h2>Button Attributes</h2>
                <div class="modal-body">
                    <p>
                        <label id="formLabel" for="websiteNameInput" class="formLabel">Name</label>
                        <input type="text" name="websiteName" id="websiteNameInput" class="formInputField" required>
                    </p>
                    <p>
                        <label id="formLabel" for="websiteURLInput" class="formLabel">Link</label>
                        <input type="text" name="websiteURL" id="websiteURLInput" class="formInputField" required>
                    </p>
                    <p>
                        <label id="formLabel" for="buttonColorInput" class="formLabel">Color</label>
                        <input type="color" name="buttonColor" id="buttonColorInput" class="formInputField" required>
                    </p>
                </div>
                <div class="modal-footer">
                    <input type="submit" id="formSubmitButton" class="formButtons" value="Save">
                    <button type="button" onclick="toggleButtonEditForm('buttonEditModal')" id="formCancelButton" class="formButtons">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
