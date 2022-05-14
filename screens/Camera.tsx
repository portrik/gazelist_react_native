import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import {
	Camera,
	CameraPermissionStatus,
	useCameraDevices,
} from 'react-native-vision-camera';

export interface CameraScreenProps {}

/**
 * Screen handling the camera permissions and taking of a photo.
 *
 * DISCLAIMER: Known to not work, sadly.
 */
const CameraScreen: React.FC<CameraScreenProps> = () => {
	const devices = useCameraDevices();
	const device = devices.back;

	const [cameraPermission, setCameraPermission] =
		useState<CameraPermissionStatus>('not-determined');
	const [loadingPermission, setLoadingPermission] = useState(false);

	/**
	 * Loads the initial camera permission state
	 */
	useEffect(() => {
		Camera.getCameraPermissionStatus().then((status) => {
			setCameraPermission(status);
			setLoadingPermission(false);
		});
	}, []);

	/**
	 * Asks for the permission if it is provided yet.
	 */
	useEffect(() => {
		if (
			!loadingPermission &&
			(cameraPermission === 'not-determined' || cameraPermission === 'denied')
		) {
			Camera.requestCameraPermission().then((status) => {
				setCameraPermission(status);
			});
		}
	}, [cameraPermission, loadingPermission]);

	return (
		<View>
			{loadingPermission || !device ? (
				<Text>Loading camera...</Text>
			) : (
				<Camera device={device} isActive={true} />
			)}
		</View>
	);
};

export default CameraScreen;
