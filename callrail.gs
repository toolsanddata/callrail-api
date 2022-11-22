function getCallRailData(accountId, companyId, profileId) {

  let config = {
    method: "get",
    headers: {
      "content-type": "application/json",
      "Authorization": "Token token="
    }
  };

  let response = UrlFetchApp.fetch(
    "https://api.callrail.com/v3/a/" + accountId + "/calls.json?start_date=yesterday&end_date=yesterday&fields=source&company_id=" + companyId,
    config
  );

  let responseCode = response.getResponseCode();
  let parsedResponse = JSON.parse(response);

  if (responseCode == 200) {
    numberOfResponsePages = parsedResponse["total_pages"]
    let callsData = [];

    for (i = 1; i <= numberOfResponsePages; i++) {
      let perPageResponse = JSON.parse(UrlFetchApp.fetch(
        "https://api.callrail.com/v3/a/" + accountId + "/calls.json?start_date=yesterday&end_date=yesterday&page=" + i + "&fields=source&company_id=" + companyId, config));
      for (j = 0; j < perPageResponse["calls"].length; j++) {
        callsData.push([
          parsedResponse["calls"][j]["start_time"],
          parsedResponse["calls"][j]["source"],
          parsedResponse["calls"][j]["direction"],
          profileId
        ])
      };
    }
    return callsData;
  } else {
    Logger.log(responseCode);
    return;
  }
}
