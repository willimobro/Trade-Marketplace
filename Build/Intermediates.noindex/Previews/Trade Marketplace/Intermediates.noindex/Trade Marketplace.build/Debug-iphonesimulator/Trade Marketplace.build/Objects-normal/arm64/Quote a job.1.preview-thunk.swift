@_private(sourceFile: "Quote a job.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI
import MapKit

extension FinalCostCalculator {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/Quote a job.swift", line: 185)
        Text(__designTimeString("#23454.[5].[1].property.[0].[0].arg[0].value", fallback: "Final Cost"))
            .font(.custom(__designTimeString("#23454.[5].[1].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[5].[1].property.[0].[0].modifier[0].arg[0].value.arg[1].value", fallback: 30)))
            .textFieldStyle(.roundedBorder)
        Text("\(totalcost)")
            .font(.custom(__designTimeString("#23454.[5].[1].property.[0].[1].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[5].[1].property.[0].[1].modifier[0].arg[0].value.arg[1].value", fallback: 30)))
            .textFieldStyle(.roundedBorder)
            .foregroundColor(.green)
    
    
#sourceLocation()
    }
}

extension ListJobContent {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/Quote a job.swift", line: 83)
        Text(__designTimeString("#23454.[4].[16].property.[0].[0].arg[0].value", fallback: "Prefered Date"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[0].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
        DatePicker(
                __designTimeString("#23454.[4].[16].property.[0].[1].arg[0].value", fallback: "Date"),
                selection: $QuotedTime,
                displayedComponents: [.date]
            )
            .datePickerStyle(.graphical)
            .accentColor(.green)
        
        Text(__designTimeString("#23454.[4].[16].property.[0].[2].arg[0].value", fallback: "Where"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[2].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[2].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            VStack (alignment: .center, spacing: __designTimeInteger("#23454.[4].[16].property.[0].[3].arg[1].value", fallback: 10)){
                Picker(__designTimeString("#23454.[4].[16].property.[0].[3].arg[2].value.[0].arg[0].value", fallback: "Option1"), selection: $QuotedLocation) {
                    Text(__designTimeString("#23454.[4].[16].property.[0].[3].arg[2].value.[0].arg[2].value.[0].arg[0].value", fallback: "You will travel to your Client."))
                }
                Picker(__designTimeString("#23454.[4].[16].property.[0].[3].arg[2].value.[1].arg[0].value", fallback: "Option2"), selection: $QuotedLocation) {
                    Text(__designTimeString("#23454.[4].[16].property.[0].[3].arg[2].value.[1].arg[2].value.[0].arg[0].value", fallback: "Your Client will travel to you."))
                    }
                .padding(.bottom, __designTimeInteger("#23454.[4].[16].property.[0].[3].arg[2].value.[1].modifier[0].arg[1].value", fallback: 10))
                MapView()
                }
            .pickerStyle(.segmented)
       
            Text(__designTimeString("#23454.[4].[16].property.[0].[4].arg[0].value", fallback: "Comments"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[4].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[4].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
        TextEditor(text: $QuotedComment)
            .font(.headline)
            .frame(height: __designTimeInteger("#23454.[4].[16].property.[0].[5].modifier[1].arg[0].value", fallback: 150), alignment: .topLeading)
            .textFieldStyle(.roundedBorder)
        VStack(alignment: .leading, spacing: __designTimeInteger("#23454.[4].[16].property.[0].[6].arg[1].value", fallback: 5)){
            Text(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[0].arg[0].value", fallback: "Material Costs"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[6].arg[2].value.[0].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            HStack {
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[1].arg[0].value.[0].arg[0].value", fallback: "Add a Cost"), text: $QuotedMaterial)
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[1].arg[0].value.[1].arg[0].value", fallback: "$"), value: $pricematerial, format: .currency(code: __designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[1].arg[0].value.[1].arg[2].value.arg[0].value", fallback: "NZD")))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                
            }
            Text(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[2].arg[0].value", fallback: "Labour Costs"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[2].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[6].arg[2].value.[2].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            HStack {
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[3].arg[0].value.[0].arg[0].value", fallback: "Add a Cost"), text: $QuotedLabour)
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[3].arg[0].value.[1].arg[0].value", fallback: "$"), value: $pricelabour, format: .currency(code: __designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[3].arg[0].value.[1].arg[2].value.arg[0].value", fallback: "NZD")))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
            }
            Text(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[4].arg[0].value", fallback: "Fuel Costs"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[4].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[6].arg[2].value.[4].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            HStack {
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[5].arg[0].value.[0].arg[0].value", fallback: "Add a Cost"), text: $QuotedFuel)
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[5].arg[0].value.[1].arg[0].value", fallback: "$"), value: $pricefuel, format: .currency(code: __designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[5].arg[0].value.[1].arg[2].value.arg[0].value", fallback: "NZD")))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
            }
            Text(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[6].arg[0].value", fallback: "Other Costs"))
            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[6].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[6].arg[2].value.[6].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            .textFieldStyle(.roundedBorder)
            HStack {
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[7].arg[0].value.[0].arg[0].value", fallback: "Add a Cost"), text: $QuotedOther)
                        .font(.headline)
                        .textFieldStyle(.roundedBorder)
                TextField(__designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[7].arg[0].value.[1].arg[0].value", fallback: "$"), value: $priceother, format: .currency(code: __designTimeString("#23454.[4].[16].property.[0].[6].arg[2].value.[7].arg[0].value.[1].arg[2].value.arg[0].value", fallback: "NZD")))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                
            }
        }
        FinalCostCalculator(totalcost: pricetotal)
        RoundedRectangle(cornerRadius: __designTimeInteger("#23454.[4].[16].property.[0].[8].arg[0].value", fallback: 11))
                .frame(width: .infinity, height: __designTimeInteger("#23454.[4].[16].property.[0].[8].modifier[0].arg[1].value", fallback: 180))
                .foregroundColor(.gray.opacity(__designTimeFloat("#23454.[4].[16].property.[0].[8].modifier[1].arg[0].value.modifier[0].arg[0].value", fallback: 0.10)))
                .overlay(VStack{
                    HStack (spacing: __designTimeInteger("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[0].value", fallback: 10)) {
                        Button(action:{
                            acceptbutton = true
                        }){
                            Image(systemName: acceptbutton ? __designTimeString("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].arg[0].value.then", fallback: "checkmark.square.fill") : __designTimeString("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].arg[0].value.else", fallback: "checkmark.square"))
                            .resizable()
                            .frame(width: __designTimeInteger("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[0].value", fallback: 36), height: __designTimeInteger("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 36))
                            .foregroundColor(.green)
                        }
                        Text(__designTimeString("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[1].arg[0].value", fallback: "Im happy with the quote and accept any terms or conditions"))
                            .font(.custom(__designTimeString("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[1].value", fallback: 18)))
                    }
                    QuoteNowButton()
                }
                    .frame(width: __designTimeInteger("#23454.[4].[16].property.[0].[8].modifier[2].arg[0].value.modifier[0].arg[0].value", fallback: 371), alignment: .center))
        
#sourceLocation()
    }
}

extension ListJobContent {
    @_dynamicReplacement(for: total()) private func __preview__total() {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/Quote a job.swift", line: 79)
       pricetotal =  pricematerial + pricelabour + pricefuel + priceother
    
#sourceLocation()
    }
}

extension ListjobView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/Quote a job.swift", line: 56)
        ListjobView()
    
#sourceLocation()
    }
}

extension ListjobView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/Quote a job.swift", line: 13)
        VStack{
            HStack(spacing: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: 30)){
                Button{
                    dismiss()
                } label: {
                Image(systemName: __designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].arg[0].value", fallback: "xmark"))
                    .resizable()
                    .scaledToFit()
                }
                Text(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[0].arg[1].value.[1].arg[0].value", fallback: "Quote a Job"))
                    .font(.custom(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            }.frame(width: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[0].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[0].modifier[0].arg[1].value", fallback: 24), alignment: .leading)
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[1].modifier[1].arg[1].value", fallback: 4), x: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[1].modifier[1].arg[2].value", fallback: 0), y: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[1].modifier[1].arg[3].value", fallback: 0))
                .opacity(__designTimeFloat("#23454.[2].[1].property.[0].[0].arg[0].value.[1].modifier[2].arg[0].value", fallback: 0.5))
            
            ScrollView(.vertical){
            VStack(alignment: .leading, spacing: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[1].value", fallback: 10)){
            Text(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value", fallback: "Title"))
                .font(.custom(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            
            ProfileSub()
                    .padding(.horizontal, __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[1].modifier[0].arg[1].value", fallback: 5))
            Text(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[2].arg[0].value", fallback: "Details"))
                    .font(.custom(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[2].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[2].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            Text(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[3].arg[0].value", fallback: "Need someone to check my wires, have been trying to get it to work for days and cant figure it out lol."))
                        .font(.custom(__designTimeString("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[3].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[3].modifier[0].arg[0].value.arg[1].value", fallback: 16)))
            ListJobContent()
            
            }
            }.frame(width: __designTimeInteger("#23454.[2].[1].property.[0].[0].arg[0].value.[2].modifier[0].arg[0].value", fallback: 351), height: .infinity, alignment: .center)
        }  .navigationBarTitleDisplayMode(.inline)
            .navigationBarHidden(__designTimeBoolean("#23454.[2].[1].property.[0].[0].modifier[1].arg[0].value", fallback: true))
        
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.ListjobView
import struct Trade_Marketplace.ListjobView_Previews
import struct Trade_Marketplace.ListJobContent
import struct Trade_Marketplace.FinalCostCalculator
