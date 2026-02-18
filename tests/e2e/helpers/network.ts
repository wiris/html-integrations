import { Page } from '@playwright/test'

export const captureTelemetryRequests = async (page: Page, foundEvents: string[]): Promise<void> => {
  // Enable request interception and handle requests
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('telemetry')) {
      const requestData = request.postData()
      if (requestData) {
        const eventCaptured = getTelemetryEventCaptured(requestData)
        foundEvents.push(eventCaptured)
      }
    }
  })
}

export const getTelemetryEventCaptured = (requestData: string): string => {
  const requestDataJSON = JSON.parse(requestData)
  const eventCaptured: string = requestDataJSON.evs[0].typ
  return eventCaptured
}