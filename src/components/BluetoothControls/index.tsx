import type { ComponentProps, FC } from 'react';

import { Col, Container, Row, Text } from '@changeme/components/Themed';
import { useAppSelector } from '@changeme/redux/store';

import { Separator } from '../Separator';

export interface BluetoothControlsProps
  extends ComponentProps<typeof Container> {}

export const BluetoothControls: FC<BluetoothControlsProps> = (props) => (
  <Container {...props}>
    <Row>
      <Col>
        <Text>Has permissions?</Text>
      </Col>
      <Col>
        <Text>
          {useAppSelector((state) => state.bluetooth.hasBluetoothPermissions)
            ? 'Yes'
            : 'No'}
        </Text>
      </Col>
    </Row>
    <Separator />
    <Row>
      <Col>
        <Text>Enabled?</Text>
      </Col>
      <Col>
        <Text>
          {useAppSelector((state) => state.bluetooth.isBluetoothEnabled)
            ? 'Yes'
            : 'No'}
        </Text>
      </Col>
    </Row>
    <Separator />
    <Row>
      <Col>
        <Text>Is scanning?</Text>
      </Col>
      <Col>
        <Text>
          {useAppSelector((state) => state.bluetooth.isScanning) ? 'Yes' : 'No'}
        </Text>
      </Col>
    </Row>
    <Separator />
    <Row>
      <Col>
        <Text>Is connecting?</Text>
      </Col>
      <Col>
        <Text>
          {useAppSelector((state) => state.bluetooth.isConnecting)
            ? 'Yes'
            : 'No'}
        </Text>
      </Col>
    </Row>
    <Separator />
    <Row>
      <Col>
        <Text>Connected peripheral</Text>
      </Col>
      <Col>
        <Text>
          {useAppSelector(
            (state) => state.bluetooth.connectedPeripheral?.peripheral.id,
          ) ?? '-'}
        </Text>
      </Col>
    </Row>
    <Separator />
  </Container>
);
