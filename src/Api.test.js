import { fetchEvaluation } from "./Api";

describe("fetchEvaluation payload normalization", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("gecerli form payloadinda yearBuilt vardir ve bos lat/lon null gider", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ safetyGrade: "B" })
    });

    await fetchEvaluation({
      yearBuilt: "2008",
      floorCount: "7",
      address: " Ataturk Mahallesi ",
      buildingType: "",
      latitude: "",
      longitude: ""
    });

    const [, requestOptions] = global.fetch.mock.calls[0];
    const parsedBody = JSON.parse(requestOptions.body);

    expect(parsedBody).toEqual({
      yearBuilt: 2008,
      floorCount: 7,
      address: "Ataturk Mahallesi",
      buildingType: null,
      latitude: null,
      longitude: null
    });
    expect(parsedBody.buildingAge).toBeUndefined();
  });
});
