import { ComponentProps, FC, Fragment, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Button } from 'react-native-paper';

import { Col, Container, Row, Text } from '@changeme/components/Themed';
import { actions } from '@changeme/redux/sagas/bluetooth';
import { useAppDispatch, useAppSelector } from '@changeme/redux/store';

import { Separator } from '../Separator';

export interface BluetoothPeripheralControlsProps
  extends ComponentProps<typeof Container> {}

export const BluetoothPeripheralControls: FC<
  BluetoothPeripheralControlsProps
> = (props) => {
  const dispatch = useAppDispatch();
  const isScanning = useAppSelector((state) => state.bluetooth.isScanning);
  const connectingToPeripheral = useAppSelector(
    (state) => state.bluetooth.connectingToPeripheral,
  );
  const discoveredPeripherals = useAppSelector(
    (state) => state.bluetooth.discoveredPeripherals,
  );
  const isConnecting = !!connectingToPeripheral;
  const startScanning = useCallback(() => {
    dispatch(actions.startScan());
  }, [dispatch]);

  return (
    <Container {...props}>
      <Row style={{ justifyContent: 'center' }}>
        <Col>
          <Button
            mode="contained-tonal"
            loading={isScanning}
            disabled={isScanning || isConnecting}
            onPress={startScanning}
          >
            Scan
          </Button>
        </Col>
      </Row>
      <Separator />
      <Row>
        <Col>
          <Text>Peripherals</Text>
        </Col>
      </Row>
      <Separator />
      <FlatList
        data={Object.values(discoveredPeripherals ?? {})}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <Row>
              <Col>
                <Text>{item.id}</Text>
              </Col>
              <Col>
                <Text>{item.name}</Text>
              </Col>
            </Row>
            <Separator />
          </>
        )}
      />
      {/* {Object.values(discoveredPeripherals ?? {}).map((peripheral) => (
        <Fragment key={peripheral.id}>
          <Row>
            <Col>
              <Text>{peripheral.id}</Text>
            </Col>
            <Col>
              <Text>{peripheral.name}</Text>
            </Col>
          </Row>
          <Separator />
        </Fragment>
      ))} */}
    </Container>
  );
};
