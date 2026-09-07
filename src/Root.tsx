import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { VoiceoverScene } from "./compositions/VoiceoverScene";
import { Scene01_Intro } from './scenes/Scene01_Intro';
import { Scene02_Stakes } from './scenes/Scene02_Stakes';
// ...inside <Compositions>:
// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="VoiceoverScene"
        component={VoiceoverScene}
        durationInFrames={1920}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
  id="Scene01Intro"
  component={Scene01_Intro}
  durationInFrames={534} // 17.8s hook, at 30fps — adjust once you preview
  fps={30}
  width={1920}
  height={1080}
/>

      
<Composition
  id="Scene02Stakes"
  component={Scene02_Stakes}
  durationInFrames={750} // segments 5–9 span ~25s at 30fps — adjust once you preview
  fps={30}
  width={1920}
  height={1080}
/>

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />
    </>
  );
};

