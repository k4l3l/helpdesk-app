import { Button } from "@chakra-ui/button";
// import { startBasicCall } from "../shared/basicVideoCall";

export const CallRoom = () => {
    // startBasicCall();
    return (<>
        <h2 className="left-align">Agora Voice Web SDK Quickstart</h2>
        <div className="row">
            <div>
                <Button type="button" id="join">JOIN</Button>
                <Button type="button" id="leave">LEAVE</Button>
            </div>
        </div>
        </>
    )
}