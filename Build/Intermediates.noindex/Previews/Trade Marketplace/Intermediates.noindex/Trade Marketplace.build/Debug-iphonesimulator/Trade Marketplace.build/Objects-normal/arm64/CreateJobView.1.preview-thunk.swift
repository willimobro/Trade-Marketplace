@_private(sourceFile: "CreateJobView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension CreateJobView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 336)
        CreateJobView()
    
#sourceLocation()
    }
}

extension SubmitJob_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 324)
        SubmitJob()
    
#sourceLocation()
    }
}

extension SubmitJob {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 300)
        RoundedRectangle(cornerRadius: __designTimeInteger("#6767.[11].[0].property.[0].[0].arg[0].value", fallback: 25))
            .foregroundColor(Color(__designTimeString("#6767.[11].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: "UploadAJobGreen")))
            .frame(width: __designTimeInteger("#6767.[11].[0].property.[0].[0].modifier[1].arg[0].value", fallback: 359), height: __designTimeInteger("#6767.[11].[0].property.[0].[0].modifier[1].arg[1].value", fallback: 56))
            .overlay(
                VStack(alignment: .center, spacing: __designTimeInteger("#6767.[11].[0].property.[0].[0].modifier[2].arg[0].value.arg[1].value", fallback: 0)){
                    HStack{
 //                       Image (systemName: "plus.app.fill")
 //                           .resizable()
//                            .frame(width: 19, height: 19, alignment: .center)
 //                           .foregroundColor(.white)
                      Text(__designTimeString("#6767.[11].[0].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value", fallback: "Submit Job"))
                          .font(.title)
                          .fontWeight(.semibold)
                         .foregroundColor(.white)

                    }}
                    .frame(width: __designTimeInteger("#6767.[11].[0].property.[0].[0].modifier[2].arg[0].value.modifier[0].arg[0].value", fallback: 319), height: __designTimeInteger("#6767.[11].[0].property.[0].[0].modifier[2].arg[0].value.modifier[0].arg[1].value", fallback: 30), alignment: .center))
        
#sourceLocation()
    }
}

extension Publish {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 291)
        Text(__designTimeString("#6767.[10].[0].property.[0].[0].arg[0].value", fallback: "publish"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6767.[10].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        SubmitJob()
        
#sourceLocation()
    }
}

extension Tags {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 282)
        Text(__designTimeString("#6767.[9].[0].property.[0].[0].arg[0].value", fallback: "Tags"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6767.[9].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
#sourceLocation()
    }
}

extension Where {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 232)
        VStack {
            Text(__designTimeString("#6767.[8].[4].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Where"))
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, __designTimeInteger("#6767.[8].[4].property.[0].[0].arg[0].value.[0].modifier[2].arg[1].value", fallback: 10))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            HStack{
                VStack {
                    VStack (alignment: .center, spacing: __designTimeInteger("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value", fallback: 10)){
                        Picker(__designTimeString("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[0].arg[0].value", fallback: "Please Select an option"), selection: $showLocationModifier) {
                            ForEach(options, id: \.self) {
                                Text($0)
                                   
                            }  .font(.subheadline)
                            
                        }
                        .pickerStyle(.segmented)
                        
                        if showLocationModifier == "They will come to me." {
                            Toggle(__designTimeString("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[0].arg[0].value", fallback: "Use My Address?"), isOn: $showLocation)
                            
                            
                            if showLocation {
                                VStack(spacing: __designTimeInteger("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[0].[0].arg[0].value", fallback: 20)){
                                    Text(__designTimeString("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[0].[0].arg[1].value.[0].arg[0].value", fallback: "Users Address"))
                                        .foregroundColor(Color.green)
                                        .multilineTextAlignment(.leading)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    MapView()
                                }
                            } else {
                                TextField(
                                    __designTimeString("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[1].[0].arg[0].value", fallback: "e.g Sink Install"),
                                    text: $manualaddress)
                                Divider()
                                    .background(.black)
                                    .padding(__designTimeInteger("#6767.[8].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[1].[1].modifier[1].arg[0].value", fallback: 0))
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
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 218)
        Text(__designTimeString("#6767.[7].[0].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6767.[7].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
#sourceLocation()
    }
}

extension Details {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 198)
        Text(__designTimeString("#6767.[6].[0].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6767.[6].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
        List {
            SelectCategory()
            SelectCategory()
            SelectCategory()
        }.frame(height: __designTimeInteger("#6767.[6].[0].property.[0].[1].modifier[0].arg[0].value", fallback: 140))
            .listStyle(.plain)
        Text(__designTimeString("#6767.[6].[0].property.[0].[2].arg[0].value", fallback: "A short job name helps tradies and the like easily identify and respond to your job"))
            .font(.footnote)
            .foregroundColor(Color.gray)
        
#sourceLocation()
    }
}

extension When {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 167)
        Text(__designTimeString("#6767.[5].[0].property.[0].[0].arg[0].value", fallback: "When"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6767.[5].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        HStack{
            Text(__designTimeString("#6767.[5].[0].property.[0].[1].arg[0].value.[0].arg[0].value", fallback: "Default: ASAP"))
                .font(.footnote)
                .foregroundColor(Color.gray)
            Spacer()
            Text(__designTimeString("#6767.[5].[0].property.[0].[1].arg[0].value.[2].arg[0].value", fallback: "Select"))
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: __designTimeString("#6767.[5].[0].property.[0].[1].arg[0].value.[3].arg[0].value", fallback: "calendar.badge.plus"))
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: __designTimeInteger("#6767.[5].[0].property.[0].[1].arg[0].value.[3].modifier[3].arg[0].value", fallback: 40), height: __designTimeInteger("#6767.[5].[0].property.[0].[1].arg[0].value.[3].modifier[3].arg[1].value", fallback: 30))
        }
            Divider()
                .background(.black)
                .padding(__designTimeInteger("#6767.[5].[0].property.[0].[2].modifier[1].arg[0].value", fallback: 0))
        
        
        Text(__designTimeString("#6767.[5].[0].property.[0].[3].arg[0].value", fallback: "When do you need the job done"))
            .font(.footnote)
            .foregroundColor(Color.gray)
        
#sourceLocation()
    }
}

extension SelectCategory {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 148)
       
        HStack{
            Text(__designTimeString("#6767.[4].[0].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Select a Category"))
            Spacer()
            Text(__designTimeString("#6767.[4].[0].property.[0].[0].arg[0].value.[2].arg[0].value", fallback: "Select"))
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: __designTimeString("#6767.[4].[0].property.[0].[0].arg[0].value.[3].arg[0].value", fallback: "chevron.right"))
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: __designTimeInteger("#6767.[4].[0].property.[0].[0].arg[0].value.[3].modifier[3].arg[0].value", fallback: 15), height: __designTimeInteger("#6767.[4].[0].property.[0].[0].arg[0].value.[3].modifier[3].arg[1].value", fallback: 15))
        }
        
    
#sourceLocation()
    }
}

extension UploadCameraIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 128)
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: __designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 72), height: __designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                Image(systemName: __designTimeString("#6767.[3].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "video.badge.plus"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#6767.[3].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22))
                    
            )
        
    
#sourceLocation()
    }
}

extension UploadPictureIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 107)
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: __designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 52), height: __designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                Image(systemName: __designTimeString("#6767.[2].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "camera"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#6767.[2].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22))
                    
            )
        
    
#sourceLocation()
    }
}

extension CreateJobView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 15)
        VStack(alignment: .leading){
            HStack(spacing: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[0].arg[0].value", fallback: 30)){
                Image(systemName: __designTimeString("#6767.[1].[3].property.[0].[0].arg[1].value.[0].arg[1].value.[0].arg[0].value", fallback: "xmark"))
                    .resizable()
                    .frame(width: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[0].value", fallback: 25), height: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 25))
                    .scaledToFit()
                
                    
                Text(__designTimeString("#6767.[1].[3].property.[0].[0].arg[1].value.[0].arg[1].value.[1].arg[0].value", fallback: "Create a job"))
                    .font(.title)
                    .fontWeight(.bold)
                    
                    
            }.frame(width: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[0].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[0].modifier[0].arg[1].value", fallback: 24), alignment: .leading)
                .padding(.horizontal, __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 20))
        
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[1].modifier[1].arg[1].value", fallback: 4), x: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[1].modifier[1].arg[2].value", fallback: 0), y: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[1].modifier[1].arg[3].value", fallback: 0))
                .opacity(__designTimeFloat("#6767.[1].[3].property.[0].[0].arg[1].value.[1].modifier[2].arg[0].value", fallback: 0.5))
                .frame(height: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[1].modifier[3].arg[0].value", fallback: 20), alignment: .bottom)
            
                
            
            ScrollView(.vertical){
                VStack(alignment: .leading, spacing: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[1].value", fallback: 10)){
                    
                    
                    HStack{
                        ForEach (__designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[0].value.[0]", fallback: 1)..<__designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[0].value.[1]", fallback: 5)) { i in
                            UploadPictureIcon()
                        }
                        UploadCameraIcon()
                    }.padding(.vertical, __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[1].value", fallback: 10))
                //Job Name
                    Text(__designTimeString("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[1].arg[0].value", fallback: "Job name"))
                        .font(.title)
                        .fontWeight(.bold)
                    VStack (alignment: .leading, spacing: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[1].value", fallback: 10)){
                        TextField(
                        __designTimeString("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[0].arg[0].value", fallback: "e.g Sink Install"),
                        text: $jobTitle)
                        Divider()
                            .background(.black)
                            .padding(__designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[1].modifier[1].arg[0].value", fallback: 0))
                        Text(__designTimeString("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[2].arg[0].value", fallback: "A short job name helps tradies and the like easily identify and respond to your job"))
                            .font(.footnote)
                            .foregroundColor(Color.gray)

                        
                    //Description
                        Text(__designTimeString("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].arg[0].value", fallback: "Description"))
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].modifier[2].arg[1].value", fallback: 10))

                        
                        TextEditor(text: $jobDesc)
                            .foregroundColor(Color.black)
                            .frame(height: __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[1].arg[0].value", fallback: 200))
                            .overlay(Rectangle()
                                .stroke(Color.secondary).opacity(__designTimeFloat("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[2].arg[0].value.modifier[1].arg[0].value", fallback: 0.5)))
                  
                    // Details
                        Details()
                    //When
                        When()
                        
                    //Where
                        Where()
                
                        
                    //Add tags
                        Tags()
                        
                    //Publish
                        Publish()

                    }
                    
                    
                } .padding(.horizontal, __designTimeInteger("#6767.[1].[3].property.[0].[0].arg[1].value.[2].arg[1].value.[0].modifier[0].arg[1].value", fallback: 20))
                
            }
        }.padding(.bottom, __designTimeInteger("#6767.[1].[3].property.[0].[0].modifier[0].arg[1].value", fallback: 60))
        
    
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
import struct Trade_Marketplace.SubmitJob
import struct Trade_Marketplace.SubmitJob_Previews
import struct Trade_Marketplace.CreateJobView_Previews
