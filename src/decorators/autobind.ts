// auto bind decorator

export function autobind(
    _target: any,
    _methodName: string,
    desciptor: PropertyDescriptor
  ) {
    const originalMethod = desciptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFunc = originalMethod.bind(this);
        return boundFunc;
      },
    };
    return adjustedDescriptor;
  }