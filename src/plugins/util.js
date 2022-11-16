import { DateTime } from 'luxon';
import blobToBuffer from 'blob-to-buffer';

const util = {
  formatPlatform(platform) {
    switch (platform) {
      case 0: return 'None';
      case 1: return 'X86';
      case 2: return 'X64';
      case 3: return 'Both';
      default: return platform;
    }
  },
  formatInstallerType(installerType) {
    switch (installerType) {
      case 0: return 'None';
      case 1: return 'MSI';
      case 2: return 'Executable';
      case 3: return 'SQL Installer';
      case 4: return 'LocalDB installer';
      default: return installerType;
    }
  },
  formatDetectionMethod(detectionMethod) {
    switch (detectionMethod) {
      case 0: return 'None';
      case 1: return 'MSI Product Code';
      case 2: return 'File';
      case 3: return 'Directory';
      case 4: return 'Registry Key';
      case 5: return 'Registry Value';
      default: return detectionMethod;
    }
  },
  formatDate(input, withTime) {
    let dt;

    if (!input) {
      return null;
    }

    if (input instanceof DateTime) {
      dt = input;
    } else if (input instanceof Date) {
      dt = DateTime.fromJSDate(input);
    } else {
      dt = DateTime.fromJSDate(new Date(input));
    }

    return withTime ? dt.toFormat('dd-MM-yyyy HH:mm:ss') : dt.toFormat('dd-MM-yyyy');
  },
  dataTableAttributes() {
    return {
      'disable-pagination': true,
      'hide-default-footer': true,
      'dense': true,
    };
  }
};

export default util;

export const convertBlobToBuffer = (blob) => {
  return new Promise((resolve, reject) => {
    blobToBuffer(blob, (err, buffer) => {
      if (err) {
        reject(err);
      }

      try {
        resolve(buffer);
      }
      catch (e) {
        reject(e);
      }
    });
  });
};
