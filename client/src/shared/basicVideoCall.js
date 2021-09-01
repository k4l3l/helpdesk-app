import AgoraRTC from "agora-rtc-sdk-ng";

let rtc = {
    localAudioTrack: null,
    client: null
};

let options = {
    // Pass your App ID here.
    appId: "",
    // Set the channel name.
    channel: "Test-channel",
    // Pass your temp token here.
    token: "",
    // Set the user ID.
    uid: Math.floor(Math.random() * 100)
};

export async function startBasicCall() {
    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", async user => {
            // Unsubscribe from the tracks of the remote user.
            await rtc.client.unsubscribe(user);
        });

    });

    window.onload = function () {

        document.getElementById("join").onclick = async function () {
            // Join an RTC channel.
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            // Create a local audio track from the audio sampled by a microphone.
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Publish the local audio tracks to the RTC channel.
            await rtc.client.publish([rtc.localAudioTrack]);

            console.log("publish success!");
        }

        document.getElementById("leave").onclick = async function () {
            // Destroy the local audio track.
            rtc.localAudioTrack.close();

            // Leave the channel.
            await rtc.client.leave();
        }
    }
}
