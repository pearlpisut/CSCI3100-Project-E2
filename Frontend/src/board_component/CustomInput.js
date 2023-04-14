import React from 'react';

// Chat custom input component
import { ChatAutoComplete, useMessageInputContext} from 'stream-chat-react';

function CustomInput({channel}) {
    const { handleSubmit } = useMessageInputContext();
    return (
        <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
            <div className="str-chat__input-flat-wrapper">
                <div className="str-chat__input-flat--textarea-wrapper">
                <ChatAutoComplete />
                </div>
                <button onClick={handleSubmit}> Send Message</button>
            </div>
        </div>
    )
}
export default CustomInput