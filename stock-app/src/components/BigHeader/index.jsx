import React from 'react';
import { Link } from 'react-router-dom';   // Add this import

/**
 * Builds a block of HTML for a large header.
 * The header includes heading text, paragraph subtext,
 * and a button. You may omit button parameters, background url
 * and background gradient settings if desired.
 * 
 * @param {*} headText <h1> header text
 * @param {*} headSubtext Paragraph subtext
 * @param {*} bgUrl Background url if applicable
 * @param {*} bgGradient Use a string argument "true" to enable background gradient
 * @param {*} btnText Text for the button
 * @param {*} btnHref Hyperlink for the button
 * @returns Block of HTML representing a BigHeader
 */
const BigHeader = ({headText, headSubtext, bgUrl, bgGradient, btnText, btnHref}) => {
    const cssGradient = "linear-gradient(rgba(4,9,30, 0.7), rgba(4,9,30, 0.7))";

    let theButton;
    if ((btnText == null || btnText === undefined)
        && (btnHref == null || btnText === undefined)) {
        theButton = <></>;
    } else {
        theButton = <Link to={btnHref} className="login-button">{btnText}</Link>;
    }

    let bgStyle;
    if (bgUrl == null || bgUrl === undefined) {
        bgStyle = {};
    } else if (bgGradient === "true") {
        bgStyle = {backgroundImage: cssGradient + ", url(" + bgUrl + ")"};
    } else {
        bgStyle = {backgroundImage: "url(" + bgUrl + ")"};
    }

    return (
        <section style={bgStyle} className="headerMain">
            <div className="header-text-box">
                <h1>{headText}</h1>
                <p>{headSubtext}</p>
                {theButton}
            </div>
        </section>
    );
}

export default BigHeader;