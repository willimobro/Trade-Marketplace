@_private(sourceFile: "QuoteAJobView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension list {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/QuoteAJobView.swift", line: 99)
        Text(__designTimeString("#21431.[4].[0].property.[0].[0].arg[0].value", fallback: "Time"))
            .font(.custom(__designTimeString("#21431.[4].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[4].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
        ListCost(purchase: __designTimeString("#21431.[4].[0].property.[0].[1].arg[0].value", fallback: "2hr, 30min"), cost: __designTimeString("#21431.[4].[0].property.[0].[1].arg[1].value", fallback: "100"))
        
        Text(__designTimeString("#21431.[4].[0].property.[0].[2].arg[0].value", fallback: "Material Costs"))
            .font(.custom(__designTimeString("#21431.[4].[0].property.[0].[2].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[4].[0].property.[0].[2].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
        ListCost(purchase: __designTimeString("#21431.[4].[0].property.[0].[3].arg[0].value", fallback: "Speedometer"), cost: __designTimeString("#21431.[4].[0].property.[0].[3].arg[1].value", fallback: "48.93"))
        ListCost(purchase: __designTimeString("#21431.[4].[0].property.[0].[4].arg[0].value", fallback: "Wiring Equipment"), cost: __designTimeString("#21431.[4].[0].property.[0].[4].arg[1].value", fallback: "25.00"))
            
        Text(__designTimeString("#21431.[4].[0].property.[0].[5].arg[0].value", fallback: "Fuel Costs"))
            .font(.custom(__designTimeString("#21431.[4].[0].property.[0].[5].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[4].[0].property.[0].[5].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
        ListCost(purchase: __designTimeString("#21431.[4].[0].property.[0].[6].arg[0].value", fallback: "168Km"), cost: __designTimeString("#21431.[4].[0].property.[0].[6].arg[1].value", fallback: "56.86"))
        Text(__designTimeString("#21431.[4].[0].property.[0].[7].arg[0].value", fallback: "calculated via TM Fuelcalc."))
            .font(.custom(__designTimeString("#21431.[4].[0].property.[0].[7].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[4].[0].property.[0].[7].modifier[0].arg[0].value.arg[1].value", fallback: 14)))
            .foregroundColor(.gray)
        
        Text(__designTimeString("#21431.[4].[0].property.[0].[8].arg[0].value", fallback: "Other"))
            .font(.custom(__designTimeString("#21431.[4].[0].property.[0].[8].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[4].[0].property.[0].[8].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
        ListCost(purchase: __designTimeString("#21431.[4].[0].property.[0].[9].arg[0].value", fallback: "N/A"), cost: __designTimeString("#21431.[4].[0].property.[0].[9].arg[1].value", fallback: "N/A"))
        
    
#sourceLocation()
    }
}

extension ListCost {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/QuoteAJobView.swift", line: 85)
        HStack{
            Text("\(purchase)")
                .font(.custom(__designTimeString("#21431.[3].[2].property.[0].[0].arg[0].value.[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[3].[2].property.[0].[0].arg[0].value.[0].modifier[0].arg[0].value.arg[1].value", fallback: 20)))
                .foregroundColor(.primary)
            Spacer()
            Text("$\(cost)")
                .font(.custom(__designTimeString("#21431.[3].[2].property.[0].[0].arg[0].value.[2].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[3].[2].property.[0].[0].arg[0].value.[2].modifier[0].arg[0].value.arg[1].value", fallback: 20)))
                .foregroundColor(.primary)
        }
    
#sourceLocation()
    }
}

extension QuoteAJobView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/QuoteAJobView.swift", line: 77)
        QuoteAJobView(Price: __designTimeString("#21431.[2].[0].property.[0].[0].arg[0].value", fallback: "230.73"), Currency: __designTimeString("#21431.[2].[0].property.[0].[0].arg[1].value", fallback: "NZD"))
    
#sourceLocation()
    }
}

extension QuoteAJobView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/QuoteAJobView.swift", line: 15)
        VStack{
            HStack(spacing: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: 30)){
                Image(systemName: __designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[0].arg[1].value.[0].arg[0].value", fallback: "xmark"))
                    .resizable()
                    .scaledToFit()
                Text(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[0].arg[1].value.[1].arg[0].value", fallback: "Review Quote"))
                    .font(.custom(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            }.frame(width: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[0].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[0].modifier[0].arg[1].value", fallback: 24), alignment: .leading)
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[1].modifier[1].arg[1].value", fallback: 4), x: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[1].modifier[1].arg[2].value", fallback: 0), y: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[1].modifier[1].arg[3].value", fallback: 0))
                .opacity(__designTimeFloat("#21431.[1].[3].property.[0].[0].arg[0].value.[1].modifier[2].arg[0].value", fallback: 0.5))
            
            ScrollView(.vertical){
            VStack(alignment: .leading, spacing: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[1].value", fallback: 10)){
            Text(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[0].arg[0].value", fallback: "Title"))
                .font(.custom(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            
            ProfileSub()
                
            Text("$\(Price) \(Currency)")
                    .font(.custom(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[2].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[2].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
                    .underline()
                
            Text(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[3].arg[0].value", fallback: "Details"))
                .font(.custom(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[3].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[3].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
            
            
            Text(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[4].arg[0].value", fallback: "Hows it going john here from ajs electrical, worked on many mitubishi vehicles and i know for sure how to fix yoor problem, read the quote below for info, Cheers john."))
                .font(.custom(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[4].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[2].value.[4].modifier[0].arg[0].value.arg[1].value", fallback: 14)))
                .foregroundColor(.secondary)
            list()
            
            }.padding()
            RoundedRectangle(cornerRadius: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value", fallback: 11))
                    .frame(width: .infinity, height: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[0].arg[1].value", fallback: 180))
                    .foregroundColor(.gray.opacity(__designTimeFloat("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[1].arg[0].value.modifier[0].arg[0].value", fallback: 0.10)))
                    .overlay(VStack{
                        HStack (spacing: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[0].value", fallback: 10)) {
                            Button(action:{
                                acceptbutton.toggle()
                            }){
                                Image(systemName: acceptbutton ? __designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].arg[0].value.then", fallback: "checkmark.square.fill") : __designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].arg[0].value.else", fallback: "checkmark.square"))
                                .resizable()
                                .frame(width: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[0].value", fallback: 36), height: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 36))
                                .foregroundColor(.green)
                            }
                            Text(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[1].arg[0].value", fallback: "Im happy with the quote and accept any terms or conditions"))
                                .font(.custom(__designTimeString("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.arg[0].value.[0].arg[1].value.[1].modifier[0].arg[0].value.arg[1].value", fallback: 18)))
                        }
                        AcceptQuoteButton()
                    }
                        .frame(width: __designTimeInteger("#21431.[1].[3].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[2].arg[0].value.modifier[0].arg[0].value", fallback: 371), alignment: .center))
            
            }.ignoresSafeArea()
        }
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.QuoteAJobView
import struct Trade_Marketplace.QuoteAJobView_Previews
import struct Trade_Marketplace.ListCost
import struct Trade_Marketplace.list
