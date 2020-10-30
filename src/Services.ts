
import { BondPlatform } from './platform';
import { Device } from './interface/Device';
import { Characteristic, PlatformAccessory } from 'homebridge';

export class FanService {
  on: Characteristic
  rotationSpeed?: Characteristic
  rotationDirection?: Characteristic

  constructor(
    platform: BondPlatform,
    accessory: PlatformAccessory) {
    let service = accessory.getService(platform.Service.Fan);
    const device: Device = accessory.context.device;
    if (service === undefined) {
      service = accessory.addService(platform.Service.Fan, accessory.displayName);
    }

    this.on = service.getCharacteristic(platform.Characteristic.On);
    if (Device.hasFan(device)) {
      this.rotationSpeed = service.getCharacteristic(platform.Characteristic.RotationSpeed);

      if (Device.hasReverseSwitch(device)) {
        this.rotationDirection = service.getCharacteristic(platform.Characteristic.RotationDirection);
      }
    }
  }
}

export class LightbulbService {
  on: Characteristic
  brightness?: Characteristic
  subType?: string

  constructor(
    platform: BondPlatform,
    accessory: PlatformAccessory,
    name: string,
    subType?: string) {
    let service = accessory.getService(platform.Service.Lightbulb);
    const device: Device = accessory.context.device;
    if (subType) {
      service = accessory.getServiceById(platform.Service.Lightbulb, subType);
    }
    
    if (service === undefined) {
      service = accessory.addService(platform.Service.Lightbulb, name, subType);
    }

    this.on = service.getCharacteristic(platform.Characteristic.On);
    if (Device.LThasBrightness(device)) {
      this.brightness = service.getCharacteristic(platform.Characteristic.Brightness);
    }
    
    this.subType = subType;
  }
}

export class SwitchService {
  on: Characteristic
  subType: string

  constructor(
    platform: BondPlatform,
    accessory: PlatformAccessory,
    name: string,
    subType: string) {
    // Check for service by subtype, then fallback to service by id only (mainly for legacy services)
    let service = accessory.getServiceById(platform.Service.Switch, subType) || accessory.getService(platform.Service.Switch);
    if (service === undefined) {
      service = accessory.addService(platform.Service.Switch, name, subType);
    }
    // Set the subtype if not defined
    if (service.subtype === undefined) {
      service.subtype = subType;
    }
    this.on = service.getCharacteristic(platform.Characteristic.On);
    this.subType = subType;
  }
}

// ButtonService is a switch that resets itself after 500ms. This provides a 
// button like experience that isn't available in homebridge.
export class ButtonService {
  on: Characteristic
  subType: string

  constructor(
    platform: BondPlatform,
    accessory: PlatformAccessory,
    name: string,
    subType: string) {
    // Check for service by subtype, then fallback to service by id only (mainly for legacy services)
    let service = accessory.getServiceById(platform.Service.Switch, subType) || accessory.getService(platform.Service.Switch);
    if (service === undefined) {
      service = accessory.addService(platform.Service.Switch, name, subType);
    }
    // Set the subtype if not defined
    if (service.subtype === undefined) {
      service.subtype = subType;
    }
    
    this.on = service.getCharacteristic(platform.Characteristic.On);
    this.on.setValue(false);

    this.on.on('set', () => {
      const timer = setInterval(() => {
        this.on.updateValue(false);
        clearInterval(timer);
      }, 500);
    });
    this.subType = subType;
  }
}

export class WindowCoveringService {
  currentPosition: Characteristic
  targetPosition: Characteristic
  positionState: Characteristic

  constructor(
    platform: BondPlatform,
    accessory: PlatformAccessory) {
    let service = accessory.getService(platform.Service.WindowCovering);
    if (service === undefined) {
      service = accessory.addService(platform.Service.WindowCovering, accessory.displayName);
    }
    this.currentPosition = service.getCharacteristic(platform.Characteristic.CurrentPosition);
    this.targetPosition = service.getCharacteristic(platform.Characteristic.TargetPosition);
    this.positionState = service.getCharacteristic(platform.Characteristic.PositionState);
  }
}