import * as React from 'react'
import * as Updates from 'expo-updates'
import { StyleSheet, Text, View, Button, DevSettings } from 'react-native'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'

export default function App() {
  const video = React.useRef<Video>(null)
  const [status, setStatus] = React.useState<AVPlaybackStatus>({} as AVPlaybackStatus)

  const seekPosition = (position = 0) => {
    video.current?.setStatusAsync({
      positionMillis: position * 1000
    })
  }

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={{
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }}
        shouldPlay
        useNativeControls
        style={{ height: 300, width: '100%', backgroundColor: 'red' }}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <Text>Environment: {__DEV__ ? 'DEV' : 'PRODUCTION'}</Text>
      <Text>Loaded: {status.isLoaded ? 'loaded' : 'not loaded'}</Text>
      {status.isLoaded && (
        <>
          <Text>Position: {status.positionMillis}</Text>
          <View style={{ flex: 1, justifyContent: 'space-around' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                alignContent: 'flex-start'
              }}>
              <Button
                title={'-10s'}
                onPress={() => seekPosition((status.positionMillis || 0) / 1000 - 10)}
              />

              <Button
                title={status.isPlaying ? 'Pause' : 'Play'}
                onPress={() =>
                  status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
              />
              <Button
                title={'+10s'}
                onPress={() => seekPosition((status.positionMillis || 0) / 1000 + 10)}
              />
            </View>

            <Button
              title={'Reload in Release Client\n (Updates.reloadAsync)'}
              disabled={__DEV__}
              onPress={() => {
                Updates.reloadAsync().then()
              }}
            />
            <Button
              title={'Reload in Dev Client\n (DevSettings.reload)'}
              disabled={!__DEV__}
              onPress={() => {
                DevSettings.reload()
              }}
            />
          </View>
        </>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
