@_private(sourceFile: "CreateJobView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension CreateJobView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 296)
        __designTimeSelection(CreateJobView(), "#29355.[11].[1].property.[0].[0]")
    
#sourceLocation()
    }
}

extension Publish {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 281)
        __designTimeSelection(Text(__designTimeString("#29355.[10].[0].property.[0].[0].arg[0].value", fallback: "publish"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#29355.[10].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10)), "#29355.[10].[0].property.[0].[0]")
        
#sourceLocation()
    }
}

extension Tags {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 272)
        __designTimeSelection(Text(__designTimeString("#29355.[9].[0].property.[0].[0].arg[0].value", fallback: "Tags"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#29355.[9].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10)), "#29355.[9].[0].property.[0].[0]")
        
#sourceLocation()
    }
}

extension Where {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 228)
        __designTimeSelection(VStack {
            __designTimeSelection(Text(__designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Where"))
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, __designTimeInteger("#29355.[8].[2].property.[0].[0].arg[0].value.[0].modifier[2].arg[1].value", fallback: 10))
                .frame(maxWidth: .infinity, alignment: .leading), "#29355.[8].[2].property.[0].[0].arg[0].value.[0]")
            
            __designTimeSelection(HStack{
                __designTimeSelection(VStack {
                    __designTimeSelection(HStack(alignment: .center){
                        __designTimeSelection(Text(__designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[0].arg[0].value", fallback: "You will travel to service provider")), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[0]")
                        __designTimeSelection(Toggle(__designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[1].arg[0].value", fallback: ""), isOn: __designTimeSelection($showLocation, "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[1].arg[1].value"))
                            .frame(maxWidth: __designTimeInteger("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value", fallback: 40)), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[1]")
                        __designTimeSelection(Text(__designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[2].arg[0].value", fallback: "Your service provider will tavel to you")), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value.[2]")
                    }.font(.subheadline), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0]")
                    __designTimeSelection(Toggle(__designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[1].arg[0].value", fallback: "Use My Address?"), isOn: __designTimeSelection($showLocation, "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[1].arg[1].value")), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[1]")
                    
                    
                    if showLocation {
                        __designTimeSelection(VStack(spacing: __designTimeInteger("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[0].[0].arg[0].value", fallback: 20)){
                            __designTimeSelection(Text(__designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[0].[0].arg[1].value.[0].arg[0].value", fallback: "Users Address"))
                                .foregroundColor(__designTimeSelection(Color.green, "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[0].[0].arg[1].value.[0].modifier[0].arg[0].value"))
                                .multilineTextAlignment(.leading)
                                .frame(maxWidth: .infinity, alignment: .leading), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[0].[0].arg[1].value.[0]")
                            __designTimeSelection(MapView(), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[0].[0].arg[1].value.[1]")
                        }, "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[0].[0]")
                    } else {
                        __designTimeSelection(TextField(
                            __designTimeString("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[1].[0].arg[0].value", fallback: "e.g Sink Install"),
                            text: __designTimeSelection($manualaddress, "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[1].[0].arg[1].value")), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[1].[0]")
                        __designTimeSelection(Divider()
                            .background(.black)
                            .padding(__designTimeInteger("#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[1].[1].modifier[1].arg[0].value", fallback: 0)), "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[2].[1].[1]")
                        
                    }
                }, "#29355.[8].[2].property.[0].[0].arg[0].value.[1].arg[0].value.[0]")
            }, "#29355.[8].[2].property.[0].[0].arg[0].value.[1]")
        }, "#29355.[8].[2].property.[0].[0]")
    
#sourceLocation()
    }
}

extension Description {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 217)
        __designTimeSelection(Text(__designTimeString("#29355.[7].[0].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#29355.[7].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10)), "#29355.[7].[0].property.[0].[0]")
        
#sourceLocation()
    }
}

extension Details {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 197)
        __designTimeSelection(Text(__designTimeString("#29355.[6].[0].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#29355.[6].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10)), "#29355.[6].[0].property.[0].[0]")
        
        __designTimeSelection(List {
            __designTimeSelection(SelectCategory(), "#29355.[6].[0].property.[0].[1].arg[0].value.[0]")
            __designTimeSelection(SelectCategory(), "#29355.[6].[0].property.[0].[1].arg[0].value.[1]")
            __designTimeSelection(SelectCategory(), "#29355.[6].[0].property.[0].[1].arg[0].value.[2]")
        }.frame(height: __designTimeInteger("#29355.[6].[0].property.[0].[1].modifier[0].arg[0].value", fallback: 140))
            .listStyle(.plain), "#29355.[6].[0].property.[0].[1]")
        __designTimeSelection(Text(__designTimeString("#29355.[6].[0].property.[0].[2].arg[0].value", fallback: "A short job name helps tradies and the like easily identify and respond to your job"))
            .font(.footnote)
            .foregroundColor(__designTimeSelection(Color.gray, "#29355.[6].[0].property.[0].[2].modifier[1].arg[0].value")), "#29355.[6].[0].property.[0].[2]")
        
#sourceLocation()
    }
}

extension When {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 166)
        __designTimeSelection(Text(__designTimeString("#29355.[5].[0].property.[0].[0].arg[0].value", fallback: "When"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#29355.[5].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10)), "#29355.[5].[0].property.[0].[0]")
        __designTimeSelection(HStack{
            __designTimeSelection(Text(__designTimeString("#29355.[5].[0].property.[0].[1].arg[0].value.[0].arg[0].value", fallback: "Default: ASAP"))
                .font(.footnote)
                .foregroundColor(__designTimeSelection(Color.gray, "#29355.[5].[0].property.[0].[1].arg[0].value.[0].modifier[1].arg[0].value")), "#29355.[5].[0].property.[0].[1].arg[0].value.[0]")
            __designTimeSelection(Spacer(), "#29355.[5].[0].property.[0].[1].arg[0].value.[1]")
            __designTimeSelection(Text(__designTimeString("#29355.[5].[0].property.[0].[1].arg[0].value.[2].arg[0].value", fallback: "Select"))
                .font(.footnote)
                .foregroundColor(__designTimeSelection(Color.gray, "#29355.[5].[0].property.[0].[1].arg[0].value.[2].modifier[1].arg[0].value")), "#29355.[5].[0].property.[0].[1].arg[0].value.[2]")
            __designTimeSelection(Image(systemName: __designTimeString("#29355.[5].[0].property.[0].[1].arg[0].value.[3].arg[0].value", fallback: "calendar.badge.plus"))
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: __designTimeInteger("#29355.[5].[0].property.[0].[1].arg[0].value.[3].modifier[3].arg[0].value", fallback: 40), height: __designTimeInteger("#29355.[5].[0].property.[0].[1].arg[0].value.[3].modifier[3].arg[1].value", fallback: 30)), "#29355.[5].[0].property.[0].[1].arg[0].value.[3]")
        }, "#29355.[5].[0].property.[0].[1]")
            __designTimeSelection(Divider()
                .background(.black)
                .padding(__designTimeInteger("#29355.[5].[0].property.[0].[2].modifier[1].arg[0].value", fallback: 0)), "#29355.[5].[0].property.[0].[2]")
        
        
        __designTimeSelection(Text(__designTimeString("#29355.[5].[0].property.[0].[3].arg[0].value", fallback: "When do you need the job done"))
            .font(.footnote)
            .foregroundColor(__designTimeSelection(Color.gray, "#29355.[5].[0].property.[0].[3].modifier[1].arg[0].value")), "#29355.[5].[0].property.[0].[3]")
        
#sourceLocation()
    }
}

extension SelectCategory {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 147)
       
        __designTimeSelection(HStack{
            __designTimeSelection(Text(__designTimeString("#29355.[4].[0].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Select a Category")), "#29355.[4].[0].property.[0].[0].arg[0].value.[0]")
            __designTimeSelection(Spacer(), "#29355.[4].[0].property.[0].[0].arg[0].value.[1]")
            __designTimeSelection(Text(__designTimeString("#29355.[4].[0].property.[0].[0].arg[0].value.[2].arg[0].value", fallback: "Select"))
                .font(.footnote)
                .foregroundColor(__designTimeSelection(Color.gray, "#29355.[4].[0].property.[0].[0].arg[0].value.[2].modifier[1].arg[0].value")), "#29355.[4].[0].property.[0].[0].arg[0].value.[2]")
            __designTimeSelection(Image(systemName: __designTimeString("#29355.[4].[0].property.[0].[0].arg[0].value.[3].arg[0].value", fallback: "chevron.right"))
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: __designTimeInteger("#29355.[4].[0].property.[0].[0].arg[0].value.[3].modifier[3].arg[0].value", fallback: 15), height: __designTimeInteger("#29355.[4].[0].property.[0].[0].arg[0].value.[3].modifier[3].arg[1].value", fallback: 15)), "#29355.[4].[0].property.[0].[0].arg[0].value.[3]")
        }, "#29355.[4].[0].property.[0].[0]")
        
    
#sourceLocation()
    }
}

extension UploadCameraIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 127)
       
        __designTimeSelection(Rectangle()
            .stroke(style: __designTimeSelection(StrokeStyle(lineWidth: __designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]), "#29355.[3].[0].property.[0].[0].modifier[0].arg[0].value"))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 72), height: __designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                __designTimeSelection(Image(systemName: __designTimeString("#29355.[3].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "video.badge.plus"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#29355.[3].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22)), "#29355.[3].[0].property.[0].[0].modifier[4].arg[0].value")
                    
            ), "#29355.[3].[0].property.[0].[0]")
        
    
#sourceLocation()
    }
}

extension UploadPictureIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 106)
       
        __designTimeSelection(Rectangle()
            .stroke(style: __designTimeSelection(StrokeStyle(lineWidth: __designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]), "#29355.[2].[0].property.[0].[0].modifier[0].arg[0].value"))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 52), height: __designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                __designTimeSelection(Image(systemName: __designTimeString("#29355.[2].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "camera"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#29355.[2].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22)), "#29355.[2].[0].property.[0].[0].modifier[4].arg[0].value")
                    
            ), "#29355.[2].[0].property.[0].[0]")
        
    
#sourceLocation()
    }
}

extension CreateJobView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 14)
        __designTimeSelection(VStack(alignment: .leading){
            __designTimeSelection(HStack(spacing: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[0].value", fallback: 30)){
                __designTimeSelection(Image(systemName: __designTimeString("#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[1].value.[0].arg[0].value", fallback: "xmark"))
                    .resizable()
                    .frame(width: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[0].value", fallback: 25), height: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 25))
                    .scaledToFit(), "#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[1].value.[0]")
                
                    
                __designTimeSelection(Text(__designTimeString("#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[1].value.[1].arg[0].value", fallback: "Create a job"))
                    .font(.title)
                    .fontWeight(.bold), "#29355.[1].[2].property.[0].[0].arg[1].value.[0].arg[1].value.[1]")
                    
                    
            }.frame(width: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[0].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[0].modifier[0].arg[1].value", fallback: 24), alignment: .leading)
                .padding(.horizontal, __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 20)), "#29355.[1].[2].property.[0].[0].arg[1].value.[0]")
        
            
            __designTimeSelection(Divider()
                .background(.black)
                .shadow(color: .black, radius: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[1].modifier[1].arg[1].value", fallback: 4), x: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[1].modifier[1].arg[2].value", fallback: 0), y: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[1].modifier[1].arg[3].value", fallback: 0))
                .opacity(__designTimeFloat("#29355.[1].[2].property.[0].[0].arg[1].value.[1].modifier[2].arg[0].value", fallback: 0.5))
                .frame(height: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[1].modifier[3].arg[0].value", fallback: 20), alignment: .bottom), "#29355.[1].[2].property.[0].[0].arg[1].value.[1]")
            
                
            
            __designTimeSelection(ScrollView(.vertical){
                __designTimeSelection(VStack(alignment: .leading, spacing: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[1].value", fallback: 10)){
                    
                    
                    __designTimeSelection(HStack{
                        __designTimeSelection(ForEach (__designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[0].value.[0]", fallback: 1)..<__designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[0].value.[1]", fallback: 5)) { i in
                            __designTimeSelection(UploadPictureIcon(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0].arg[1].value.[0]")
                        }, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[0]")
                        __designTimeSelection(UploadCameraIcon(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value.[1]")
                    }.padding(.vertical, __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[1].value", fallback: 10)), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0]")
                //Job Name
                    __designTimeSelection(Text(__designTimeString("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[1].arg[0].value", fallback: "Job name"))
                        .font(.title)
                        .fontWeight(.bold), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[1]")
                    __designTimeSelection(VStack (alignment: .leading, spacing: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[1].value", fallback: 10)){
                        __designTimeSelection(TextField(
                        __designTimeString("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[0].arg[0].value", fallback: "e.g Sink Install"),
                        text: __designTimeSelection($jobTitle, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[0].arg[1].value")), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[0]")
                        __designTimeSelection(Divider()
                            .background(.black)
                            .padding(__designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[1].modifier[1].arg[0].value", fallback: 0)), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[1]")
                        __designTimeSelection(Text(__designTimeString("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[2].arg[0].value", fallback: "A short job name helps tradies and the like easily identify and respond to your job"))
                            .font(.footnote)
                            .foregroundColor(__designTimeSelection(Color.gray, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[2].modifier[1].arg[0].value")), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[2]")

                        
                    //Description
                        __designTimeSelection(Text(__designTimeString("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].arg[0].value", fallback: "Description"))
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].modifier[2].arg[1].value", fallback: 10)), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3]")

                        
                        __designTimeSelection(TextEditor(text: __designTimeSelection($jobDesc, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].arg[0].value"))
                            .foregroundColor(__designTimeSelection(Color.black, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[0].arg[0].value"))
                            .frame(height: __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[1].arg[0].value", fallback: 200))
                            .overlay(__designTimeSelection(Rectangle()
                                .stroke(__designTimeSelection(Color.secondary, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[2].arg[0].value.modifier[0].arg[0].value")).opacity(__designTimeFloat("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[2].arg[0].value.modifier[1].arg[0].value", fallback: 0.5)), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[2].arg[0].value")), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4]")
                  
                    // Details
                        __designTimeSelection(Details(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[5]")
                    //When
                        __designTimeSelection(When(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[6]")
                        
                    //Where
                        __designTimeSelection(Where(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[7]")
                
                        
                    //Add tags
                        __designTimeSelection(Tags(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[8]")
                        
                    //Publish
                        __designTimeSelection(Publish(), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[9]")

                    }, "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2]")
                    
                    
                } .padding(.horizontal, __designTimeInteger("#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0].modifier[0].arg[1].value", fallback: 20)), "#29355.[1].[2].property.[0].[0].arg[1].value.[2].arg[1].value.[0]")
                
            }, "#29355.[1].[2].property.[0].[0].arg[1].value.[2]")
        }, "#29355.[1].[2].property.[0].[0]")
        
    
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
