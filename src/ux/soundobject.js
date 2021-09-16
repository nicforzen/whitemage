
import { GameObject } from '../control/gameobject.js';
import { Script } from '../control/script.js';

export function SoundObject(instance, audioName, x, y, intensity){
    let obj = new GameObject("_s");
    obj.x = x;
    obj.y = y;
    let script = new Script();
    var audio = null;
    script.onStart = function(){
        audio = instance.sound.getAudioInstance(audioName);
        audio.play()
    }
    script.onUpdate = function(){
        let dx = obj.x - instance.camera.x
        let dy = obj.y - instance.camera.y
        let distance = Math.sqrt( dx*dx + dy*dy )
        let scalar = (distance <= 1) ? 1 : intensity*100 / (distance * distance)
        let volume = (scalar > 1) ? 1 : scalar
        audio.setVolume(volume)
    }
    obj.addScript(script)
    return obj;
}