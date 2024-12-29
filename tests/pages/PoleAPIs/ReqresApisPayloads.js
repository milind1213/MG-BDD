
class ReqrePayloads {  
   static userPayload()
    {
      return {
        name: `User_${Date.now()}`,
        job: `Automation Tester`,
       };
    }
 }

module.exports = { ReqrePayloads };