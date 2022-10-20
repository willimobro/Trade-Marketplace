@_private(sourceFile: "CreateJobView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension SubmitJob {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 351)
        RoundedRectangle(cornerRadius: __designTimeInteger("#2453.[12].[6].property.[0].[0].arg[0].value", fallback: 25))
            .foregroundColor(Color(__designTimeString("#2453.[12].[6].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: "UploadAJobGreen")))
            .frame(width: __designTimeInteger("#2453.[12].[6].property.[0].[0].modifier[1].arg[0].value", fallback: 359), height: __designTimeInteger("#2453.[12].[6].property.[0].[0].modifier[1].arg[1].value", fallback: 56))
            .overlay(
                VStack(alignment: .center, spacing: __designTimeInteger("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.arg[1].value", fallback: 0)){
                    HStack{
 //                       Image (systemName: "plus.app.fill")
 //                           .resizable()
//                            .frame(width: 19, height: 19, alignment: .center)
 //                           .foregroundColor(.white)
                        Button  {
                            self.activate.UploadData(data: [[__designTimeString("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[0].key", fallback: "nah") : __designTimeString("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[0].value", fallback: "Password")]], collection: __designTimeString("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[1].value", fallback: "bro"), document: __designTimeString("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[2].value", fallback: "uid"))
                        } label:    {
                            Text(__designTimeString("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[1].value.[0].arg[0].value", fallback: "Submit Job"))
                                .font(.title)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }

                    }}
                    .frame(width: __designTimeInteger("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.modifier[0].arg[0].value", fallback: 319), height: __designTimeInteger("#2453.[12].[6].property.[0].[0].modifier[2].arg[0].value.modifier[0].arg[1].value", fallback: 30), alignment: .center))
        
#sourceLocation()
    }
}

extension CreateJobView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 338)
        CreateJobView()
    
#sourceLocation()
    }
}

extension Publish {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 320)
        Text(__designTimeString("#2453.[10].[0].property.[0].[0].arg[0].value", fallback: "Publish"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#2453.[10].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 30))
        Text(__designTimeString("#2453.[10].[0].property.[0].[1].arg[0].value", fallback: "By clicking the submit button below, I hereby agree to and accept the following [terms](https://example.com) , [conditions](https://example.com) and [Privacy Policy](https://example.com) of Trade Marketplace"))
            .font(.footnote)
            .padding(.bottom, __designTimeInteger("#2453.[10].[0].property.[0].[1].modifier[1].arg[1].value", fallback: 10))
        
#sourceLocation()
    }
}

extension Tags {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 298)
        HStack{
            Text(__designTimeString("#2453.[9].[1].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Tags"))
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, __designTimeInteger("#2453.[9].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[1].value", fallback: 10))
            Spacer()
            Text(__designTimeString("#2453.[9].[1].property.[0].[0].arg[0].value.[2].arg[0].value", fallback: "optional"))
                .font(.footnote)
                .foregroundColor(Color.gray)
                .padding(.top, __designTimeInteger("#2453.[9].[1].property.[0].[0].arg[0].value.[2].modifier[2].arg[1].value", fallback: 14))
        }
        
        TextEditor(text: $tags)
            .foregroundColor(Color.black)
            .frame(height: __designTimeInteger("#2453.[9].[1].property.[0].[1].modifier[1].arg[0].value", fallback: 100))
            .overlay(Rectangle()
            .stroke(Color.secondary).opacity(__designTimeFloat("#2453.[9].[1].property.[0].[1].modifier[2].arg[0].value.modifier[1].arg[0].value", fallback: 0.5)))
        
#sourceLocation()
    }
}

extension Where {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 246)
        VStack {
            Text(__designTimeString("#2453.[8].[4].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Where"))
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, __designTimeInteger("#2453.[8].[4].property.[0].[0].arg[0].value.[0].modifier[2].arg[1].value", fallback: 10))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            HStack{
                VStack {
                    VStack (alignment: .center, spacing: __designTimeInteger("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value", fallback: 10)){
                        Picker(__designTimeString("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[0].arg[0].value", fallback: "Please Select an option"), selection: $showLocationModifier) {
                            ForEach(options, id: \.self) {
                                Text($0)
                                   
                            }  .font(.subheadline)
                            
                        }
                        .pickerStyle(.segmented)
                        
                        if showLocationModifier == "They will come to me." {
                            Toggle(__designTimeString("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[0].arg[0].value", fallback: "Use My Address?"), isOn: $showLocation)
                                .padding(.top, __designTimeInteger("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[0].modifier[0].arg[1].value", fallback: 15))
                            
                            
                            if showLocation {
                                VStack(spacing: __designTimeInteger("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[0].[0].arg[0].value", fallback: 20)){
                                    Text(__designTimeString("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[0].[0].arg[1].value.[0].arg[0].value", fallback: "Users Address"))
                                        .foregroundColor(Color.green)
                                        .multilineTextAlignment(.leading)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    MapView()
                                }
                            } else {
                                TextField(
                                    __designTimeString("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[1].[0].arg[0].value", fallback: "123 example street, Invercargill"),
                                    text: $manualaddress)
                                Divider()
                                    .background(.black)
                                    .padding(__designTimeInteger("#2453.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[1].[1].modifier[1].arg[0].value", fallback: 0))
                            }
                        }
                    }
                }
            }
        }
    
#sourceLocation()
    }
}

extension Description {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 232)
        Text(__designTimeString("#2453.[7].[0].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#2453.[7].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
#sourceLocation()
    }
}

extension Details {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 214)
        Text(__designTimeString("#2453.[6].[1].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#2453.[6].[1].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
        List {
            SelectCategory(category: $category)
        }.frame(height: __designTimeInteger("#2453.[6].[1].property.[0].[1].modifier[0].arg[0].value", fallback: 140))
            .listStyle(.plain)
        Text(__designTimeString("#2453.[6].[1].property.[0].[2].arg[0].value", fallback: "Selecting more than one category helps you recvieve more quotes"))
            .font(.footnote)
            .foregroundColor(Color.gray)
        
#sourceLocation()
    }
}

extension When {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 182)
        Text(__designTimeString("#2453.[5].[1].property.[0].[0].arg[0].value", fallback: "When"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#2453.[5].[1].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        HStack{
            TextField(__designTimeString("#2453.[5].[1].property.[0].[1].arg[0].value.[0].arg[0].value", fallback: "Default: ASAP"), text: $WhenDataMain)
                .font(.footnote)
                .foregroundColor(Color.gray)
            Spacer()
            Text(__designTimeString("#2453.[5].[1].property.[0].[1].arg[0].value.[2].arg[0].value", fallback: "Select"))
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: __designTimeString("#2453.[5].[1].property.[0].[1].arg[0].value.[3].arg[0].value", fallback: "calendar.badge.plus"))
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: __designTimeInteger("#2453.[5].[1].property.[0].[1].arg[0].value.[3].modifier[3].arg[0].value", fallback: 40), height: __designTimeInteger("#2453.[5].[1].property.[0].[1].arg[0].value.[3].modifier[3].arg[1].value", fallback: 30))
        }
            Divider()
                .background(.black)
                .padding(__designTimeInteger("#2453.[5].[1].property.[0].[2].modifier[1].arg[0].value", fallback: 0))
        
        
        Text(__designTimeString("#2453.[5].[1].property.[0].[3].arg[0].value", fallback: "When do you need the job done"))
            .font(.footnote)
            .foregroundColor(Color.gray)
        
#sourceLocation()
    }
}

extension SelectCategory {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 165)
       
        HStack{
            Picker(__designTimeString("#2453.[4].[2].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Selected Category"), selection: $category)    {
                ForEach(categories, id: \.self) {
                    Text($0)
                }
            }
                .font(.footnote)
                .foregroundColor(Color.gray)
        }
        
    
#sourceLocation()
    }
}

extension UploadCameraIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 134)
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: __designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 72), height: __designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                Image(systemName: __designTimeString("#2453.[3].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "video.badge.plus"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#2453.[3].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22))
                    
            )
        
    
#sourceLocation()
    }
}

extension UploadPictureIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 113)
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: __designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 52), height: __designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                Image(systemName: __designTimeString("#2453.[2].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "camera"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#2453.[2].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22))
                    
            )
        
    
#sourceLocation()
    }
}

extension CreateJobView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 19)
        VStack(alignment: .leading){
            HStack(spacing: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[0].arg[0].value", fallback: 30)){
                Image(systemName: __designTimeString("#2453.[1].[7].property.[0].[0].arg[1].value.[0].arg[1].value.[0].arg[0].value", fallback: "xmark"))
                    .resizable()
                    .frame(width: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[0].value", fallback: 25), height: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 25))
                    .scaledToFit()
                
                    
                Text(__designTimeString("#2453.[1].[7].property.[0].[0].arg[1].value.[0].arg[1].value.[1].arg[0].value", fallback: "Create a job"))
                    .font(.title)
                    .fontWeight(.bold)
                    
                    
            }.frame(width: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[0].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[0].modifier[0].arg[1].value", fallback: 24), alignment: .leading)
                .padding(.horizontal, __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 20))
        
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[1].modifier[1].arg[1].value", fallback: 4), x: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[1].modifier[1].arg[2].value", fallback: 0), y: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[1].modifier[1].arg[3].value", fallback: 0))
                .opacity(__designTimeFloat("#2453.[1].[7].property.[0].[0].arg[1].value.[1].modifier[2].arg[0].value", fallback: 0.5))
                .frame(height: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[1].modifier[3].arg[0].value", fallback: 20), alignment: .bottom)
            
                
            
            ScrollView(.vertical){
                VStack(alignment: .leading, spacing: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[1].value", fallback: 10)){
                    
                    
                    HStack{
                        ForEach (__designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[0].value.[0]", fallback: 1)..<__designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[0].value.[1]", fallback: 5)) { i in
                            UploadPictureIcon()
                        }
                        UploadCameraIcon()
                    }.padding(.vertical, __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[1].value", fallback: 10))
                //Job Name
                    Text(__designTimeString("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[1].arg[0].value", fallback: "Job name"))
                        .font(.title)
                        .fontWeight(.bold)
                    VStack (alignment: .leading, spacing: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[1].value", fallback: 10)){
                        TextField(
                        __designTimeString("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[0].arg[0].value", fallback: "e.g Sink Install"),
                        text: $jobTitle)
                        Divider()
                            .background(.black)
                            .padding(__designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[1].modifier[1].arg[0].value", fallback: 0))
                        Text(__designTimeString("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[2].arg[0].value", fallback: "A short job name helps tradies and the like easily identify and respond to your job"))
                            .font(.footnote)
                            .foregroundColor(Color.gray)

                        
                    //Description
                        Text(__designTimeString("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].arg[0].value", fallback: "Description"))
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].modifier[2].arg[1].value", fallback: 10))

                        
                        TextEditor(text: $jobDesc)
                            .foregroundColor(Color.black)
                            .frame(height: __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[1].arg[0].value", fallback: 200))
                            .overlay(Rectangle()
                                .stroke(Color.secondary).opacity(__designTimeFloat("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[2].arg[0].value.modifier[1].arg[0].value", fallback: 0.5)))
                        Group{
                            // Details
                            Details(category: $category)
                            //When
                            When(WhenDataMain: $WhendataMain)
                            
                            //Where
                            Where(manualaddress: $manualaddress)
                            
                            
                            //Add tags
                            Tags(tags: $tags)
                            
                            //Publish
                            Publish()
                            //SubmitJob
                            SubmitJob(JobName: $jobTitle, Category: $category, When: $WhendataMain, Where: $manualaddress, Tags: $tags)
                        }
                    }
                    
                    
                } .padding(.horizontal, __designTimeInteger("#2453.[1].[7].property.[0].[0].arg[1].value.[2].arg[1].value.[0].modifier[0].arg[1].value", fallback: 20))
                
            }
        }.padding(.bottom, __designTimeInteger("#2453.[1].[7].property.[0].[0].modifier[0].arg[1].value", fallback: 60))
        
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.CreateJobView
import struct Trade_Marketplace.UploadPictureIcon
import struct Trade_Marketplace.UploadCameraIcon
import struct Trade_Marketplace.SelectCategory
import struct Trade_Marketplace.When
import struct Trade_Marketplace.Details
import struct Trade_Marketplace.Description
import struct Trade_Marketplace.Where
import struct Trade_Marketplace.Tags
import struct Trade_Marketplace.Publish
import struct Trade_Marketplace.CreateJobView_Previews
import struct Trade_Marketplace.SubmitJob
