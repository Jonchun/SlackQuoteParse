const fs = require( "fs" );

fs.readFile( "text", "utf8", ( err, data ) => {
    if ( err ) {
        return console.log( err );
    }
    const output = run( [ data ] );
    console.log( output );
} );

function run( input, parameters ) {
    const data = input[ 0 ];
    const textLines = data.split( /\r?\n/ );
    let textLinesLen = textLines.length;

    for ( let i = 0; i < textLinesLen; i++ ) {
        const regTime = /^\[\d+:\d+\]\s{0,}$/;
        const match = regTime.exec( textLines[ i ] );

        const regTimeAMPM = /^\[\d+:\d+ (?:AM|PM)\]\s{0,}$/;
        const matchAMPM = regTimeAMPM.exec( textLines[ i ] );
        if ( textLines[ i ] === "" ) {
            textLines.splice( i, 1 );
            i -= 1;
        } else if ( match ) {
            textLines.splice( i, 1 );
            i -= 1;
        } else if ( matchAMPM ) {
            textLines[ i - 1 ] = `${ textLines[ i - 1 ].trim() } ${ textLines[ i ].trim() }`;
            textLines.splice( i, 1 );
            i -= 1;
        }
    }

    let output = "";
    let inSnippet = false;
    textLinesLen = textLines.length;
    for ( let i = 0; i < textLinesLen; i++ ) {
        const regName = /^(?:.+) \[(?:\d+:\d+ ?(?:AM|PM))\]\s{0,}$/;
        const match = regName.exec( textLines[ i ] );
        const regSnippet = /^added.+snippet(?::.+)?$/;
        const matchSnippet = regSnippet.exec( textLines[ i ] );
        const regEndSnippet = /^.+Comments?.+(?:Click to expand)?(?:Collapse)?.+(?:lines)?$/;
        const matchEndSnippet = regEndSnippet.exec( textLines[ i ] );
        const regNewDay = /----- .+ -----/;
        const matchNewDay = regNewDay.exec( textLines[ i ] );

        if ( matchSnippet ) {
            textLines[ i ] = `> _${ textLines[ i ].trim() }_\n>\`\`\``;
            inSnippet = true;
        } else if ( matchEndSnippet ) {
            textLines[ i ] = "```\n";
            inSnippet = false;
        } else if ( match && output === "" ) {
            textLines[ i ] = `*${ textLines[ i ].trim() }*\n`;
        } else if ( match ) {
            textLines[ i ] = `\n*${ textLines[ i ].trim() }*\n`;
        } else if ( inSnippet ) {
            textLines[ i ] = `${ textLines[ i ].trim() }\n`;
        } else if ( matchNewDay ) {
            textLines[ i ] = `\n_${ textLines[ i ].trim() }_\n`;
        } else {
            textLines[ i ] = `> ${ textLines[ i ].trim() }\n`;
        }
        output += textLines[ i ];
    }
    return output;
}
